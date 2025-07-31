const User = require('../model/User');
const { UserDTO, UserProfileDTO } = require('../dto/UserDTO');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class UserService {
  async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      const user = new User(userData);
      await user.save();

      const token = user.getJWTToken();

      return {
        success: true,
        token,
        user: new UserProfileDTO(user)
      };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  async login(email, password) {
    try {
      // Find user and include password field
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check password
      const isPasswordMatched = await user.comparePassword(password);
      if (!isPasswordMatched) {
        throw new Error('Invalid email or password');
      }

      const token = user.getJWTToken();

      return {
        success: true,
        token,
        user: new UserProfileDTO(user)
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  async getUserProfile(userId) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      return new UserProfileDTO(user);
    } catch (error) {
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }
  }

  async updateProfile(userId, updateData) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Check if email is being updated and if it's already taken
      if (updateData.email && updateData.email !== user.email) {
        const existingUser = await User.findOne({ email: updateData.email });
        if (existingUser) {
          throw new Error('Email already in use');
        }
      }

      Object.assign(user, updateData);
      await user.save();

      return new UserProfileDTO(user);
    } catch (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findById(userId).select('+password');
      
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      user.password = newPassword;
      await user.save();

      return { message: 'Password changed successfully' };
    } catch (error) {
      throw new Error(`Failed to change password: ${error.message}`);
    }
  }

  async getAllUsers(filters = {}) {
    try {
      let query = {};
      
      if (filters.role) query.role = filters.role;
      if (filters.search) {
        query.$or = [
          { name: new RegExp(filters.search, 'i') },
          { email: new RegExp(filters.search, 'i') }
        ];
      }

      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 10;
      const skip = (page - 1) * limit;

      const users = await User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await User.countDocuments(query);

      return {
        users: UserDTO.fromArray(users),
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  async deleteUser(userId, adminId) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Don't allow admin to delete themselves
      if (userId === adminId) {
        throw new Error('Cannot delete your own account');
      }

      await User.findByIdAndDelete(userId);

      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  async updateUserRole(userId, newRole, adminId) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Don't allow admin to change their own role
      if (userId === adminId) {
        throw new Error('Cannot change your own role');
      }

      user.role = newRole;
      await user.save();

      return new UserDTO(user);
    } catch (error) {
      throw new Error(`Failed to update user role: ${error.message}`);
    }
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        throw new Error('User not found');
      }

      return new UserProfileDTO(user);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async requestPasswordReset(email) {
    try {
      const user = await User.findOne({ email });
      
      if (!user) {
        throw new Error('User not found with this email');
      }

      const resetToken = user.getResetPasswordToken();
      await user.save();

      // In a real application, you would send an email here
      // For now, we'll just return the token (remove this in production)
      return {
        message: 'Password reset token generated',
        resetToken // Remove this in production
      };
    } catch (error) {
      throw new Error(`Failed to request password reset: ${error.message}`);
    }
  }

  async resetPassword(resetToken, newPassword) {
    try {
      const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
      });

      if (!user) {
        throw new Error('Invalid or expired reset token');
      }

      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      const token = user.getJWTToken();

      return {
        success: true,
        token,
        user: new UserProfileDTO(user)
      };
    } catch (error) {
      throw new Error(`Failed to reset password: ${error.message}`);
    }
  }
}

module.exports = new UserService();