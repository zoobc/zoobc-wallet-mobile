PROTOC_GEN_TS_PATH="./node_modules/.bin/protoc-gen-ts"

#OUT_DIR="/src/app/grpc"

#PROTOPATH = "externals/proto"

#protoc \
#-I=$PROTOPATH
#--plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
#--js_out=import_style=commonjs:"/src/app/grpc" \
#--grpc-web_out=import_style=commonjs,mode=grpcwebtext:src/app/grpc \
#--ts_out="${OUT_DIR}" \
#externals/proto/model/*.proto \
#--proto_path=externals/proto



#echo $PWD

protoc -I=${PWD}/externals/proto \
${PWD}/externals/proto/model/*.proto \
--js_out=import_style=commonjs:/Users/Ary/test \
--grpc-web_out=import_style=commonjs,mode=grpcwebtext:/Users/Ary/test

#protoc \
#-I=$PROTOPATH
#--plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
#--js_out=import_style=commonjs:$OUT_DIR \
#--ts_out="service=true:${OUT_DIR}" \
#--grpc-web_out=import_style=commonjs,mode=grpcwebtext:$OUT_DIR \
#service/*.proto \
#--proto_path=$PROTOPATH

#protoc \
#-I=$PROTOPATH
#--plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
#--js_out=import_style=commonjs:$OUT_DIR \
#--ts_out="${OUT_DIR}" \
#--grpc-web_out=import_style=commonjs,mode=grpcwebtext:$OUT_DIR \
#google/api/*.proto \
#--proto_path=$PROTOPATH