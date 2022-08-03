materialAdmin

    // =========================================================================
    // Header Messages and Notifications list Data
    // =========================================================================
    // =========================================================================
    // Header Messages and Notifications list Data
    // =========================================================================

    .service('messageService', ['$localStorage', function($localStorage,$rootScope){
            var notf=[];
           this.getMessage = function() {
            return notf;
        }


        this.setMessage=function(message, detail, sUrl){

               notf.push({

                text:message,
                other:detail,
                suurl:sUrl
                });

                $localStorage.notfy=[];
                $localStorage.notfy=notf;
                
                }
                
        /*this.roots=  function(w){
            var sUrl= w.suurl;
        $rootScope.redirect(sUrl);
         }*/

        this.clearAllMessages=function(){
            $localStorage.notfy=[];
        }
}])
    

    // =========================================================================
    // Best Selling Widget Data (Home Page)
    // =========================================================================

    .service('bestsellingService', ['$resource', function($resource){
        this.getBestselling = function(img, name, range) {
            var gbList = $resource("data/best-selling.json");
            
            return gbList.get({
                img: img,
                name: name,
                range: range,
            });
        }
    }])

    
    // =========================================================================
    // Todo List Widget Data
    // =========================================================================

    .service('todoService', ['$resource', function($resource){
        this.getTodo = function(todo) {
            var todoList = $resource("data/todo.json");
            
            return todoList.get({
                todo: todo
            });
        }
    }])


    // =========================================================================
    // Recent Items Widget Data
    // =========================================================================
    
    .service('recentitemService', ['$resource', function($resource){
        this.getRecentitem = function(id, name, price) {
            var recentitemList = $resource("data/recent-items.json");
            
            return recentitemList.get ({
                id: id,
                name: name,
                price: price
            })
        }
    }])


    // =========================================================================
    // Recent Posts Widget Data
    // =========================================================================
    
    .service('recentpostService', ['$resource', function($resource){
        this.getRecentpost = function(img, user, text) {
            var recentpostList = $resource("data/messages-notifications.json");
            
            return recentpostList.get ({
                img: img,
                user: user,
                text: text
            })
        }
    }])
    
    // =========================================================================
    // Data Table
    // =========================================================================
    
    .service('tableService', [function(){
        this.data = [
            {
                "id": 10238,
                "name": "Marc Barnes",
                "email": "marc.barnes54@example.com",
                "username": "MarcBarnes",
                "contact": "(382)-122-5003"
            },
            {   
                "id": 10243,
                "name": "Glen Curtis",
                "email": "glen.curtis11@example.com",
                "username": "GlenCurtis",
                "contact": "(477)-981-4948"
            },
            {
                "id": 10248,
                "name": "Beverly Gonzalez",
                "email": "beverly.gonzalez54@example.com",
                "username": "BeverlyGonzalez",
                "contact": "(832)-255-5161"
            },
            {
                "id": 10253,
                "name": "Yvonne Chavez",
                "email": "yvonne.chavez@example.com",
                "username": "YvonneChavez",
                "contact": "(477)-446-3715"
            },
            {
                "id": 10234,
                "name": "Melinda Mitchelle",
                "email": "melinda@example.com",
                "username": "MelindaMitchelle",
                "contact": "(813)-716-4996"
                
            },
            {
                "id": 10239,
                "name": "Shannon Bradley",
                "email": "shannon.bradley42@example.com",
                "username": "ShannonBradley",
                "contact": "(774)-291-9928"
            },
            {
                "id": 10244,
                "name": "Virgil Kim",
                "email": "virgil.kim81@example.com",
                "username": "VirgilKim",
                "contact": "(219)-181-7898"
            },
            {
                "id": 10249,
                "name": "Letitia Robertson",
                "email": "letitia.rober@example.com",
                "username": "Letitia Robertson",
                "contact": "(647)-209-4589"
            },
            {
                "id": 10237,
                "name": "Claude King",
                "email": "claude.king22@example.com",
                "username": "ClaudeKing",
                "contact": "(657)-988-8701"
            },
            {
                "id": 10242,
                "name": "Roland Craig",
                "email": "roland.craig47@example.com",
                "username": "RolandCraig",
                "contact": "(932)-935-9471"
            },
            {
                "id": 10247,
                "name": "Colleen Parker",
                "email": "colleen.parker38@example.com",
                "username": "ColleenParker",
                "contact": "(857)-459-2792"
            },
            {
                "id": 10252,
                "name": "Leah Jensen",
                "email": "leah.jensen27@example.com",
                "username": "LeahJensen",
                "contact": "(861)-275-4686"
            },
            {
                "id": 10236,
                "name": "Harold Martinez",
                "email": "martinez67@example.com",
                "username": "HaroldMartinez",
                "contact": "(836)-634-9133"
            },
            {
                "id": 10241,
                "name": "Keith Lowe",
                "email": "keith.lowe96@example.com",
                "username": "KeithLowe",
                "contact": "(778)-787-3100"
            },
            {
                "id": 10246,
                "name": "Charles Walker",
                "email": "charles.walker90@example.com",
                "username": "CharlesWalker",
                "contact": "(486)-440-4716"
            },
            {
                "id": 10251,
                "name": "Lillie Curtis",
                "email": "lillie.curtis12@example.com",
                "username": "LillieCurtis",
                "contact": "(342)-510-2258"
            },
            {
                "id": 10235,
                "name": "Genesis Reynolds",
                "email": "genesis@example.com",
                "username": "GenesisReynolds",
                "contact": "(339)-375-1858"
            },
            {
                "id": 10240,
                "name": "Oscar Palmer",
                "email": "oscar.palmer24@example.com",
                "username": "OscarPalmer",
                "contact": "(544)-270-9912"
            },
            {
                "id": 10245,
                "name": "Lena Bishop",
                "email": "Lena Bishop",
                "username": "LenaBishop",
                "contact": "(177)-521-1556"
            },
            {
                "id": 10250,
                "name": "Kent Nguyen",
                "email": "kent.nguyen34@example.com",
                "username": "KentNguyen",
                "contact": "(506)-533-6801"
            }
        ];
    }])


    // =========================================================================
    // Nice Scroll - Custom Scroll bars
    // =========================================================================
    .service('nicescrollService', function() {
        var ns = {};
        ns.niceScroll = function(selector, color, cursorWidth) {
            
            $(selector).niceScroll({
                cursorcolor: color,
                cursorborder: 0,
                cursorborderradius: 0,
                cursorwidth: cursorWidth,
                bouncescroll: true,
                mousescrollstep: 100,
                autohidemode: false
            });
        }
        
        return ns;
    })


    //==============================================
    // BOOTSTRAP GROWL
    //==============================================

    .service('growlService', function(){
        var gs = {};
        gs.growl = function(message, type) {
            $.growl({
                message: message
            },{
                type: type,
                allow_dismiss: false,
                label: 'Cancel',
                className: 'btn-xs btn-inverse',
                placement: {
                    from: 'top',
                    align: 'right'
                },
                delay: 2500,
                animate: {
                        enter: 'animated bounceIn',
                        exit: 'animated bounceOut'
                },
                offset: {
                    x: 20,
                    y: 85
                }
            });
        }
        
        return gs;
    })

    .service('rootScopeCrud', [
        '$localStorage',
        '$rootScope',
        '$timeout',
        'otherUtils',
        function (
            $localStorage,
            $rootScope,
            $timeout,
            otherUtils,
        ) {
            // this service provide the crud to save data in $rootscope.saveStateObj
            /*
            * Exposed info i.e. saved with data
            * saveTime: Date in Millisec => saved at time
            * */

            //init's
            $rootScope.saveStateObj = {}; // bcos its lost on refresh
            // $rootScope.saveStateObj = $rootScope.saveStateObj || {};

            // function identifier
            this.save = save;
            this.remove = remove;
            this.load = load;
            this.isExist = isExist;
            this.fetchDetail = fetchDetail;
            this.reset = reset;

            // Actual Function
            // save data and other useful info. about data on key
            function save(key, data, filterAllFn = true) {

                let path = typeof key === 'string' && key.trim().length > 0 ? key.trim() : false;
                let dataToSave = typeof data !== 'undefined' ? data : false;

                if(typeof data === 'object' && !Array.isArray(data)){
                    dataToSave = otherUtils.removeAngularObject(dataToSave); // removed Angular keys
                    if(filterAllFn)
                        dataToSave = otherUtils.removeAllFn(dataToSave);
                }

                if(path && dataToSave){

                    $rootScope.saveStateObj[path] = {
                        data: dataToSave,
                        saveTime: Date.now()
                    };
                    return true;
                }else
                    return false;
            }

            // remove the data if not required on key
            function remove(key) {
                let path = typeof key === 'string' && key.trim().length > 0 ? key.trim() : false;

                if(path && $rootScope.saveStateObj.hasOwnProperty(path)){
                    delete $rootScope.saveStateObj[path];
                    return true;
                }else
                    return false;
            }

            // assign the data on wrapper/container of key
            function load(key, wrapper) {
                let container = typeof wrapper === 'object' ? wrapper : false;
                let path = typeof key === 'string' && key.trim().length > 0 ? key.trim() : false;
                let data = angular.copy($rootScope.saveStateObj[path].data);

                if(path){
                    if(container){
                        Object.assign(container, data);
                        return true;
                    }else
                        return data;
                }else
                    return false;
            }

            // check is key exist or not
            function isExist(key) {
                let path = typeof key === 'string' && key.trim().length > 0 ? key.trim() : false;

                if(path){
                    return !!$rootScope.saveStateObj[path];
                }else
                    return false;
            }

            // fetch other info. about data
            function fetchDetail(key, keyToFetch) {

                let path = typeof key === 'string' && key.trim().length > 0 ? key.trim() : false;
                keyToFetch = typeof keyToFetch === 'string' && keyToFetch.trim().length > 0 ? keyToFetch.trim() : false;

                if(path && isExist(path) && keyToFetch){
                    return $rootScope.saveStateObj[path][keyToFetch];
                }else
                    return false;
            }

            function reset() {
                $timeout(function(){
                    $rootScope.saveStateObj = {};
                }, 1000);
            }
        }
    ])

    .service('cacheData', [
        'rootScopeCrud',
        function (
            rootScopeCrud
        ) {

            // private arg
            // 1. timeOE i.e. Number => time of expire of current key data in minutes

            // initalizer
            this.init = init;
            this.getDetail = cacheDetails;

            /*
            * param: key/path
            * return: object/false
            * desc: it fetches the detail of cached date like its saveTime etc.
            * */

            function cacheDetails(key, keyToFetch = 'saveTime') {
                return rootScopeCrud.fetchDetail(key, keyToFetch);
            }

            function init(param) {

                let keyObj = {
                    timeOE: 3
                };

                if(typeof param === "number")
                    keyObj.timeOE = param;
                else if(typeof param === 'object')
                    Object.assign(keyObj, param);

                return {
                    load,
                    upsert
                };

                /*
                * param: key/path
                * return : bool
                * des: it checks that key/path exist or not and if exist than its expires or not
                * */
                function isOk(key) {

                    if(rootScopeCrud.isExist(key)){

                        // check that is the cached data expired or not
                        let saveTime = rootScopeCrud.fetchDetail(key, 'saveTime') + keyObj.timeOE * 60 * 1000;

                        if(Date.now() > saveTime)
                            return false;
                        else
                            return true
                    }else
                        return false;
                }

                /*
                * param: key/path
                * return : data/false
                * des: it return data if exist else return false
                * */
                function load(key) {
                    if(isOk(key)){
                        return rootScopeCrud.load(key);
                    }else
                        return false;
                }

                /*
                * param: key/path
                * return: Boo;
                * des: it save/update data
                * */
                function upsert(key, data) {
                    rootScopeCrud.save(key, data);
                }
            }
        }
    ])
