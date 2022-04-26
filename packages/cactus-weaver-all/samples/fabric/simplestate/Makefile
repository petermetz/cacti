test-local:
	cp -r ../../../core/network/fabric-interop-cc/libs/testutils .
	cp go.mod go.mod.bk
	cp go.mod.local go.mod
	go mod tidy
	go test -v .
	mv go.mod.bk go.mod
	rm -rf testutils
test:
	go mod tidy
	go test -v .
clean:
	rm -rf mocks simplestate
