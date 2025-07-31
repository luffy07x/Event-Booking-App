class UserDTO {
  constructor(user) {
    this.id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.phone = user.phone;
    this.role = user.role;
    this.avatar = user.avatar;
    this.isEmailVerified = user.isEmailVerified;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  static fromArray(users) {
    return users.map(user => new UserDTO(user));
  }
}

class UserCreateDTO {
  constructor(data) {
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.phone = data.phone;
    this.role = data.role || 'user';
  }
}

class UserUpdateDTO {
  constructor(data) {
    if (data.name !== undefined) this.name = data.name;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.avatar !== undefined) this.avatar = data.avatar;
  }
}

class UserProfileDTO {
  constructor(user) {
    this.id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.phone = user.phone;
    this.avatar = user.avatar;
    this.role = user.role;
    this.isEmailVerified = user.isEmailVerified;
    this.createdAt = user.createdAt;
  }
}

class UserPublicDTO {
  constructor(user) {
    this.id = user._id;
    this.name = user.name;
    this.avatar = user.avatar;
    this.role = user.role;
  }

  static fromArray(users) {
    return users.map(user => new UserPublicDTO(user));
  }
}

module.exports = {
  UserDTO,
  UserCreateDTO,
  UserUpdateDTO,
  UserProfileDTO,
  UserPublicDTO
};