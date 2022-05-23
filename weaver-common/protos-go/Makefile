CACTUS_WEAVER_ROOT=../..

.PHONY: build
build:
	sh $(CACTUS_WEAVER_ROOT)/weaver-common/get-fabric-protos.sh $(CACTUS_WEAVER_ROOT)
	sh build-protos.sh
	
.PHONY: clean-build
clean-build:
	rm -R `ls -1 -d ./*/`
	
.PHONY: clean
clean:
	rm -rf $(CACTUS_WEAVER_ROOT)/weaver-common/fabric-protos