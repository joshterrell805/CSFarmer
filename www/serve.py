from http.server import SimpleHTTPRequestHandler, socketserver

class Handler(SimpleHTTPRequestHandler):
    def send_response(self, *args, **kwargs):
        SimpleHTTPRequestHandler.send_response(self, *args, **kwargs)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Method', '*')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Expires', '-1')

server = socketserver.TCPServer(('localhost', 8000), Handler)
server.serve_forever()