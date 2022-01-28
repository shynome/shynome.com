gh-page-build:
	pprefix=/$$(basename $$PWD) npm run build
gh-page:
	make gh-page-build && \
	git init --initial-branch=gh-page build/ && \
	REPO=$$(git config --get remote.origin.url) && \
	cd build/ && \
	git remote add origin $$REPO && \
	touch .nojekyll && \
	git add -A . && \
	git commit -m 'push page' && \
	git push -f origin gh-page