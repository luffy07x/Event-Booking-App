import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

public class Main {
    private static final int PORT = 8080;
    private static final Path FRONTEND_DIR = Paths.get("/workspace/simple-bank/frontend");

    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
        server.createContext("/api", new ApiHandler());
        server.createContext("/", new StaticFileHandler());
        server.setExecutor(Executors.newCachedThreadPool());
        System.out.println("Simple Bank server running on http://localhost:" + PORT);
        server.start();
    }

    static class ApiHandler implements HttpHandler {
        private final AccountService accountService = AccountService.getInstance();

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            try {
                String method = exchange.getRequestMethod();
                String path = exchange.getRequestURI().getPath();
                if (!path.startsWith("/api")) {
                    sendText(exchange, 404, "Not Found");
                    return;
                }

                // Routes:
                // GET  /api/accounts                       -> list
                // POST /api/accounts                       -> create (name, initialBalance)
                // GET  /api/accounts/{id}                  -> get
                // POST /api/accounts/{id}/deposit          -> deposit (amount)
                // POST /api/accounts/{id}/withdraw         -> withdraw (amount)

                List<String> segments = segments(path);
                if (segments.size() >= 2 && segments.get(1).equals("accounts")) {
                    if (segments.size() == 2) {
                        if (method.equals("GET")) {
                            handleListAccounts(exchange);
                            return;
                        } else if (method.equals("POST")) {
                            handleCreateAccount(exchange);
                            return;
                        }
                    } else if (segments.size() >= 3) {
                        String accountId = segments.get(2);
                        if (segments.size() == 3) {
                            if (method.equals("GET")) {
                                handleGetAccount(exchange, accountId);
                                return;
                            }
                        } else if (segments.size() == 4) {
                            String action = segments.get(3);
                            if (method.equals("POST")) {
                                if (action.equals("deposit")) {
                                    handleDeposit(exchange, accountId);
                                    return;
                                } else if (action.equals("withdraw")) {
                                    handleWithdraw(exchange, accountId);
                                    return;
                                }
                            }
                        }
                    }
                }

                sendText(exchange, 404, "Not Found");
            } catch (Exception e) {
                e.printStackTrace();
                sendJson(exchange, 500, jsonError("Server error"));
            } finally {
                exchange.close();
            }
        }

        private void handleListAccounts(HttpExchange exchange) throws IOException {
            List<Account> accounts = accountService.listAccounts();
            String json = accounts.stream().map(Main::toJson).collect(Collectors.joining(",", "[", "]"));
            sendJson(exchange, 200, json);
        }

        private void handleCreateAccount(HttpExchange exchange) throws IOException {
            String body = readBody(exchange);
            Map<String, String> form = parseForm(body);
            String name = form.getOrDefault("name", "").trim();
            String initialStr = form.getOrDefault("initialBalance", "0").trim();
            if (name.isEmpty()) {
                sendJson(exchange, 400, jsonError("Name is required"));
                return;
            }
            double initial;
            try {
                initial = Double.parseDouble(initialStr);
            } catch (NumberFormatException e) {
                sendJson(exchange, 400, jsonError("Invalid initial balance"));
                return;
            }
            if (initial < 0) {
                sendJson(exchange, 400, jsonError("Initial balance cannot be negative"));
                return;
            }
            Account created = accountService.createAccount(name, initial);
            sendJson(exchange, 201, toJson(created));
        }

        private void handleGetAccount(HttpExchange exchange, String accountId) throws IOException {
            Optional<Account> account = accountService.getAccount(accountId);
            if (account.isEmpty()) {
                sendJson(exchange, 404, jsonError("Account not found"));
                return;
            }
            sendJson(exchange, 200, toJson(account.get()));
        }

        private void handleDeposit(HttpExchange exchange, String accountId) throws IOException {
            String body = readBody(exchange);
            Map<String, String> form = parseForm(body);
            String amountStr = form.getOrDefault("amount", "").trim();
            double amount;
            try {
                amount = Double.parseDouble(amountStr);
            } catch (NumberFormatException e) {
                sendJson(exchange, 400, jsonError("Invalid amount"));
                return;
            }
            if (amount <= 0) {
                sendJson(exchange, 400, jsonError("Amount must be positive"));
                return;
            }
            try {
                Account updated = accountService.deposit(accountId, amount);
                sendJson(exchange, 200, toJson(updated));
            } catch (IllegalArgumentException e) {
                sendJson(exchange, 404, jsonError(e.getMessage()));
            }
        }

        private void handleWithdraw(HttpExchange exchange, String accountId) throws IOException {
            String body = readBody(exchange);
            Map<String, String> form = parseForm(body);
            String amountStr = form.getOrDefault("amount", "").trim();
            double amount;
            try {
                amount = Double.parseDouble(amountStr);
            } catch (NumberFormatException e) {
                sendJson(exchange, 400, jsonError("Invalid amount"));
                return;
            }
            if (amount <= 0) {
                sendJson(exchange, 400, jsonError("Amount must be positive"));
                return;
            }
            try {
                Account updated = accountService.withdraw(accountId, amount);
                sendJson(exchange, 200, toJson(updated));
            } catch (IllegalArgumentException e) {
                sendJson(exchange, 400, jsonError(e.getMessage()));
            }
        }
    }

    static class StaticFileHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            try {
                URI uri = exchange.getRequestURI();
                String path = uri.getPath();
                if (path.equals("/")) {
                    path = "/index.html";
                }
                Path file = FRONTEND_DIR.resolve(path.substring(1)).normalize();
                if (!file.startsWith(FRONTEND_DIR) || !Files.exists(file) || Files.isDirectory(file)) {
                    sendText(exchange, 404, "Not Found");
                    return;
                }
                byte[] content = Files.readAllBytes(file);
                String contentType = contentType(file.toString());
                Headers headers = exchange.getResponseHeaders();
                headers.add("Content-Type", contentType);
                exchange.sendResponseHeaders(200, content.length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(content);
                }
            } finally {
                exchange.close();
            }
        }
    }

    // ===== In-memory Model & Service =====

    static class Account {
        final String id;
        final String name;
        double balance;
        final LocalDateTime createdAt;

        Account(String id, String name, double initialBalance) {
            this.id = id;
            this.name = name;
            this.balance = initialBalance;
            this.createdAt = LocalDateTime.now();
        }
    }

    static class AccountService {
        private static final AccountService INSTANCE = new AccountService();
        private final Map<String, Account> accounts = new ConcurrentHashMap<>();

        public static AccountService getInstance() {
            return INSTANCE;
        }

        public synchronized Account createAccount(String name, double initialBalance) {
            String id = UUID.randomUUID().toString().substring(0, 8);
            Account account = new Account(id, name, initialBalance);
            accounts.put(id, account);
            return account;
        }

        public List<Account> listAccounts() {
            return new ArrayList<>(accounts.values());
        }

        public Optional<Account> getAccount(String id) {
            return Optional.ofNullable(accounts.get(id));
        }

        public synchronized Account deposit(String id, double amount) {
            Account account = accounts.get(id);
            if (account == null) {
                throw new IllegalArgumentException("Account not found");
            }
            account.balance += amount;
            return account;
        }

        public synchronized Account withdraw(String id, double amount) {
            Account account = accounts.get(id);
            if (account == null) {
                throw new IllegalArgumentException("Account not found");
            }
            if (amount > account.balance) {
                throw new IllegalArgumentException("Insufficient funds");
            }
            account.balance -= amount;
            return account;
        }
    }

    // ===== Helpers =====

    private static String toJson(Account a) {
        return "{" +
                "\"id\":\"" + escape(a.id) + "\"," +
                "\"name\":\"" + escape(a.name) + "\"," +
                "\"balance\":" + String.format(Locale.US, "%.2f", a.balance) + "," +
                "\"createdAt\":\"" + escape(a.createdAt.toString()) + "\"" +
                "}";
    }

    private static String jsonError(String message) {
        return "{" +
                "\"error\":\"" + escape(message) + "\"" +
                "}";
    }

    private static String escape(String s) {
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private static String readBody(HttpExchange exchange) throws IOException {
        try (InputStream is = exchange.getRequestBody()) {
            return new String(is.readAllBytes(), StandardCharsets.UTF_8);
        }
    }

    private static Map<String, String> parseForm(String body) {
        Map<String, String> map = new HashMap<>();
        if (body == null || body.isEmpty()) return map;
        for (String pair : body.split("&")) {
            int idx = pair.indexOf('=');
            if (idx >= 0) {
                String key = urlDecode(pair.substring(0, idx));
                String val = urlDecode(pair.substring(idx + 1));
                map.put(key, val);
            }
        }
        return map;
    }

    private static String urlDecode(String s) {
        return URLDecoder.decode(s, StandardCharsets.UTF_8);
    }

    private static List<String> segments(String path) {
        return Arrays.stream(path.split("/"))
                .filter(p -> !p.isEmpty())
                .collect(Collectors.toList());
    }

    private static void sendText(HttpExchange exchange, int status, String text) throws IOException {
        byte[] bytes = text.getBytes(StandardCharsets.UTF_8);
        Headers headers = exchange.getResponseHeaders();
        headers.add("Content-Type", "text/plain; charset=utf-8");
        exchange.sendResponseHeaders(status, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private static void sendJson(HttpExchange exchange, int status, String json) throws IOException {
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        Headers headers = exchange.getResponseHeaders();
        headers.add("Content-Type", "application/json; charset=utf-8");
        exchange.sendResponseHeaders(status, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private static String contentType(String file) {
        String f = file.toLowerCase(Locale.ROOT);
        if (f.endsWith(".html")) return "text/html; charset=utf-8";
        if (f.endsWith(".css")) return "text/css; charset=utf-8";
        if (f.endsWith(".js")) return "application/javascript; charset=utf-8";
        if (f.endsWith(".json")) return "application/json; charset=utf-8";
        if (f.endsWith(".png")) return "image/png";
        if (f.endsWith(".jpg") || f.endsWith(".jpeg")) return "image/jpeg";
        if (f.endsWith(".svg")) return "image/svg+xml";
        return "application/octet-stream";
    }
}