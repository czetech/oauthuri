BUILD_DIR := ./build
BUILD_WEB_DIR := $(BUILD_DIR)/web

web:
	mkdir -p $(BUILD_DIR)
	rm -rf $(BUILD_WEB_DIR)
	mkdir $(BUILD_WEB_DIR)
	pandoc --to=html5 --output=$(BUILD_WEB_DIR)/index.html \
		--standalone --variable=pagetitle=OAuthURI --self-contained \
		--css=docs.css \
		--css=https://unpkg.com/github-markdown-css@5.0.0/github-markdown.css \
		README.md
	sed -i 's/<body>/<body class="markdown-body">/' $(BUILD_WEB_DIR)/index.html
	npm ci --include=dev
	npm run build
	cp redirect.html dist/oauthuri.js config.json build/web/
	npm cache clean --force --silent

clean:
	rm -rf $(BUILD_DIR)
	npm run clean
