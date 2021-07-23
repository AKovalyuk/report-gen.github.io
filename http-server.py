from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

def run(server_class=ThreadingHTTPServer, handler_class=SimpleHTTPRequestHandler):
    handler_class.extensions_map.update({
        ".js": "application/javascript",
    })
    server_address = ('', 8080)
    httpd = server_class(server_address, handler_class)
    httpd.serve_forever()

if __name__ == "__main__":
      run()