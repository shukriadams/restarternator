# fail on all errors
set -e

# when running on a CI system like travis, use switch "--ci"
# when running locally, force clean jspm build with "--jspm"
JSPM=0
DOCKERPUSH=0
SMOKETEST=0
BUILD=1
while [ -n "$1" ]; do 
    case "$1" in
    --dockerpush) DOCKERPUSH=1 ;;
    --test) SMOKETEST=1 ;;
    --nobuild) BUILD=0 ;;
    esac 
    shift
done

if [ $BUILD -eq 1 ]; then

    # Setup work folder to build from. This is needed on dev systems where we want to be able to bypass local node modules etc
    # We use cp on CI systems because we can't be sure rsync is available there
    # NOTE : jspm hits github each time you run a local build. If you do this enough times you'll hit your github rate limit

    mkdir -p .stage
    rsync ./../src .stage \
        --verbose \
        --recursive  \
        --exclude=node_modules \
        --exclude=.* 

    BUILDCONTAINER=shukriadams/node20build:0.0.1

    # install with --no-bin-links to avoid simlinks, this is needed to copy build content around
    docker run \
        -v $(pwd)/.stage/src:/tmp/build \
        $BUILDCONTAINER sh -c 'cd /tmp/build/ && npm install --no-bin-links --production'

    # build 3: Build the base container, using the zip. We do this in a subfolder so we can limit the size of the docker build context,
    # else docker will pass in everything in current folder 
    docker build -t shukriadams/restarternator .

    echo "Build complete"

fi

if [ $SMOKETEST -eq 1 ]; then
    echo "Testing ... "

    # test build
    docker-compose -f docker-compose.yml down 
    docker-compose -f docker-compose.yml up -d 
    
    # give container a chance to start
    sleep 5 
    
    # confirm http process in container is responding
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" localhost:5101/test) 
    
    echo "test status: ${STATUS}"

    if [ ! $STATUS -eq 200 ] ; then
        echo "ERROR : container test failed with status ${STATUS}"
        exit 1
    fi

    docker-compose -f docker-compose.yml down 
    echo "container test passed"
fi

if [ $DOCKERPUSH -eq 1 ]; then
    TAG=$(git describe --tags --abbrev=0) 
    docker login -u $DOCKER_USER -p $DOCKER_PASS 
    docker tag shukriadams/restarternator:latest shukriadams/restarternator:$TAG 
    docker push shukriadams/restarternator:$TAG 

    echo "Push complete"
fi

