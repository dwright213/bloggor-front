/* jshint ignore:start */

/* jshint ignore:end */

define('bloggor-front/adapters/application', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].ActiveModelAdapter.extend({
    host: "http://bloggor.herokuapp.com",
    namespace: "api"
  });

});
define('bloggor-front/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'bloggor-front/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  var App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('bloggor-front/controllers/blog', ['exports', 'ember', 'ember-pusher'], function (exports, Ember, EmberPusher) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend(EmberPusher['default'].Bindings, {
    logPusherEvents: true,
    PUSHER_SUBSCRIPTIONS: {
      blogsChannel: ["edit-blog"]
    },
    actions: {
      editBlog: function editBlog(payload) {
        console.log(payload);
        this.store.pushPayload("blog", payload);
      }
    }

  });

});
define('bloggor-front/controllers/blogs', ['exports', 'ember', 'ember-pusher'], function (exports, Ember, EmberPusher) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend(EmberPusher['default'].Bindings, {
    logPusherEvents: true,
    PUSHER_SUBSCRIPTIONS: {
      blogsChannel: ["new-blog", "delete-blog"]
    },
    actions: {
      newBlog: function newBlog(payload) {
        console.log(payload);
        this.store.pushPayload("blog", payload);
      },
      deleteBlog: function deleteBlog(payload) {
        console.log(payload.blog.id);

        this.store.find("blog", payload.blog.id).then(function (blog) {
          blog.deleteRecord();
        });
      }
    }

  });

});
define('bloggor-front/controllers/blogs/show', ['exports', 'ember', 'ember-pusher'], function (exports, Ember, EmberPusher) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend(EmberPusher['default'].Bindings, {
    logPusherEvents: true,
    PUSHER_SUBSCRIPTIONS: {
      blogsChannel: ["new-blog", "delete-blog"]
    },

    actions: {
      newBlog: function newBlog(payload) {
        console.log(payload);
        this.store.pushPayload("blog", payload);
      },
      deleteBlog: function deleteBlog(payload) {
        console.log(payload.blog.id);
        this.transitionToRoute("blogs");

        this.store.find("blog", payload.blog.id).then(function (blog) {
          blog.deleteRecord();
        });
      }

    }

  });

});
define('bloggor-front/initializers/app-version', ['exports', 'bloggor-front/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;

  exports['default'] = {
    name: "App Version",
    initialize: function initialize(container, application) {
      var appName = classify(application.toString());
      Ember['default'].libraries.register(appName, config['default'].APP.version);
    }
  };

});
define('bloggor-front/initializers/ember-moment', ['exports', 'ember-moment/helpers/moment', 'ember-moment/helpers/ago', 'ember-moment/helpers/duration', 'ember'], function (exports, moment, ago, duration, Ember) {

  'use strict';

  var initialize = function initialize() {
    var registerHelper;

    if (Ember['default'].HTMLBars) {
      registerHelper = function (helperName, fn) {
        Ember['default'].HTMLBars._registerHelper(helperName, Ember['default'].HTMLBars.makeBoundHelper(fn));
      };
    } else {
      registerHelper = Ember['default'].Handlebars.helper;
    };

    registerHelper("moment", moment['default']);
    registerHelper("ago", ago['default']);
    registerHelper("duration", duration['default']);
  };

  exports['default'] = {
    name: "ember-moment",

    initialize: initialize
  };
  /* container, app */

  exports.initialize = initialize;

});
define('bloggor-front/initializers/export-application-global', ['exports', 'ember', 'bloggor-front/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal && !window[classifiedName]) {
      window[classifiedName] = application;
    }
  }

  ;

  exports['default'] = {
    name: "export-application-global",

    initialize: initialize
  };

});
define('bloggor-front/initializers/pusher', ['exports', 'ember', 'bloggor-front/config/environment', 'ember-pusher/controller'], function (exports, Ember, ENV, controller) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, app) {
    container.register("pusher:main", controller.Controller);
    var options = ENV['default'].APP.PUSHER_OPTS;

    Ember['default'].assert("Define PUSHER_OPTS in your config", typeof options !== "undefined");
    Ember['default'].assert("Pusher library is required", typeof window.Pusher !== "undefined");

    var pusher = new window.Pusher(options.key, options.connection);
    var pusherController = container.lookup("pusher:main");
    pusherController.didCreatePusher(pusher);

    app.inject("controller", "pusher", "pusher:main");
    app.inject("route", "pusher", "pusher:main");
  }

  exports['default'] = {
    name: "pusher",
    initialize: initialize
  };

});
define('bloggor-front/models/blog', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    title: DS['default'].attr("string"),
    body: DS['default'].attr("string"),
    created_at: DS['default'].attr("string"),
    updated_at: DS['default'].attr("string")
  });

});
define('bloggor-front/router', ['exports', 'ember', 'bloggor-front/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {
    this.resource("home", { path: "/home" });
    this.route("about");
    this.resource("blogs", function () {
      this.route("show", { path: ":blog_id" });
    });
  });

  exports['default'] = Router;

});
define('bloggor-front/routes/blogs/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function model() {
      return this.store.find("blog");
    }
  });

});
define('bloggor-front/routes/blogs/show', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function model(params) {
      return this.store.find("blog", params.blog_id);
    }
  });

});
define('bloggor-front/templates/about', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("\n  Hi I'm Dan and I make websites.\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("img");
        dom.setAttribute(el2,"src","http://i0.kym-cdn.com/photos/images/original/000/234/739/fa5.jpg");
        dom.setAttribute(el2,"alt","A picture of a dog using a chemistry set, with the words 'I have no idea what I'm doing' superimposed");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('bloggor-front/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("nav");
        dom.setAttribute(el1,"id","bloggor-nav");
        dom.setAttribute(el1,"class","navbar-fixed-top navbar-inverse");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","container-fluid");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","navbar-header");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        dom.setAttribute(el4,"class","nav navbar-nav");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","main-body");
        dom.setAttribute(el1,"class","container-fluid");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","col-md-10 col-md-offset-1");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","footer");
        dom.setAttribute(el1,"class","col-md-12");
        var el2 = dom.createTextNode("\n  danwright.co 1995\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, inline = hooks.inline, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0, 1, 1, 1]);
        var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),-1,-1);
        var morph1 = dom.createMorphAt(dom.childAt(element0, [3]),-1,-1);
        var morph2 = dom.createMorphAt(dom.childAt(element0, [5]),-1,-1);
        var morph3 = dom.createMorphAt(dom.childAt(fragment, [2, 1]),0,1);
        inline(env, morph0, context, "link-to", ["Home", "home"], {});
        inline(env, morph1, context, "link-to", ["About", "about"], {});
        inline(env, morph2, context, "link-to", ["Blogs", "blogs"], {});
        content(env, morph3, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('bloggor-front/templates/blogs', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        content(env, morph0, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('bloggor-front/templates/blogs/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),-1,-1);
          inline(env, morph0, context, "link-to", [get(env, context, "title"), "blogs.show", get(env, context, "this")], {});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("ul");
        dom.setAttribute(el1,"class","list-unstyled");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),0,-1);
        block(env, morph0, context, "each", [], {}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('bloggor-front/templates/blogs/show', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("  ");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-primary");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n\n\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-xs-12 panel-date");
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","panel-text");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [1]);
        var element1 = dom.childAt(element0, [3]);
        var morph0 = dom.createMorphAt(dom.childAt(element0, [1, 1]),-1,-1);
        var morph1 = dom.createMorphAt(dom.childAt(element1, [1]),0,1);
        var morph2 = dom.createMorphAt(dom.childAt(element1, [3]),0,1);
        content(env, morph0, context, "model.title");
        inline(env, morph1, context, "moment", [get(env, context, "model.created_at"), "MMM Do YYYY", get(env, context, "iso")], {});
        content(env, morph2, context, "model.body");
        return fragment;
      }
    };
  }()));

});
define('bloggor-front/templates/home', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("\n  This is the test version of my new website, to replace Wordpress.\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('bloggor-front/tests/adapters/application.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/application.js should pass jshint', function() { 
    ok(true, 'adapters/application.js should pass jshint.'); 
  });

});
define('bloggor-front/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(true, 'app.js should pass jshint.'); 
  });

});
define('bloggor-front/tests/controllers/blog.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/blog.js should pass jshint', function() { 
    ok(true, 'controllers/blog.js should pass jshint.'); 
  });

});
define('bloggor-front/tests/controllers/blogs.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/blogs.js should pass jshint', function() { 
    ok(true, 'controllers/blogs.js should pass jshint.'); 
  });

});
define('bloggor-front/tests/controllers/blogs/show.jshint', function () {

  'use strict';

  module('JSHint - controllers/blogs');
  test('controllers/blogs/show.js should pass jshint', function() { 
    ok(true, 'controllers/blogs/show.js should pass jshint.'); 
  });

});
define('bloggor-front/tests/helpers/resolver', ['exports', 'ember/resolver', 'bloggor-front/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('bloggor-front/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('bloggor-front/tests/helpers/start-app', ['exports', 'ember', 'bloggor-front/app', 'bloggor-front/router', 'bloggor-front/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('bloggor-front/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('bloggor-front/tests/integration/about-page-test', ['ember', 'qunit', 'bloggor-front/tests/helpers/start-app'], function (Ember, qunit, startApp) {

  'use strict';

  var App;

  qunit.module("Integration - About Page", {
    beforeEach: function beforeEach() {
      App = startApp['default']();
    },
    afterEach: function afterEach() {
      Ember['default'].run(App, "destroy");
    }
  });

  qunit.test("Should navigate to the About page", function (assert) {
    visit("/").then(function () {
      click("a:contains('About')").then(function () {
        assert.equal(find("h3").text(), "About");
      });
    });
  });

});
define('bloggor-front/tests/integration/about-page-test.jshint', function () {

  'use strict';

  module('JSHint - integration');
  test('integration/about-page-test.js should pass jshint', function() { 
    ok(true, 'integration/about-page-test.js should pass jshint.'); 
  });

});
define('bloggor-front/tests/integration/landing-page-test', ['ember', 'qunit', 'bloggor-front/tests/helpers/start-app'], function (Ember, qunit, startApp) {

  'use strict';

  var App;

  qunit.module("Integration - Landing Page", {
    beforeEach: function beforeEach() {
      App = startApp['default']();
    },
    afterEach: function afterEach() {
      Ember['default'].run(App, "destroy");
    }
  });

  qunit.test("Should welcome me to Boston Ember", function (assert) {
    visit("/").then(function () {
      assert.equal(find("h2#title").text(), "Welcome to Dan's Bloggor Front end");
    });
  });

  qunit.test("Should allow navigating back to root from another page", function (assert) {
    visit("/about").then(function () {
      click("a:contains(\"Home\")").then(function () {
        assert.notEqual(find("h3").text(), "About");
      });
    });
  });

});
define('bloggor-front/tests/integration/landing-page-test.jshint', function () {

  'use strict';

  module('JSHint - integration');
  test('integration/landing-page-test.js should pass jshint', function() { 
    ok(true, 'integration/landing-page-test.js should pass jshint.'); 
  });

});
define('bloggor-front/tests/models/blog.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/blog.js should pass jshint', function() { 
    ok(true, 'models/blog.js should pass jshint.'); 
  });

});
define('bloggor-front/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(true, 'router.js should pass jshint.'); 
  });

});
define('bloggor-front/tests/routes/blogs/index.jshint', function () {

  'use strict';

  module('JSHint - routes/blogs');
  test('routes/blogs/index.js should pass jshint', function() { 
    ok(true, 'routes/blogs/index.js should pass jshint.'); 
  });

});
define('bloggor-front/tests/routes/blogs/show.jshint', function () {

  'use strict';

  module('JSHint - routes/blogs');
  test('routes/blogs/show.js should pass jshint', function() { 
    ok(true, 'routes/blogs/show.js should pass jshint.'); 
  });

});
define('bloggor-front/tests/test-helper', ['bloggor-front/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('bloggor-front/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('bloggor-front/config/environment', ['ember'], function(Ember) {
  var prefix = 'bloggor-front';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("bloggor-front/tests/test-helper");
} else {
  require("bloggor-front/app")["default"].create({"PUSHER_OPTS":{"key":"1e5793784101bb7963f6","connection":{},"logAllEvents":true},"name":"bloggor-front","version":"0.0.0.c6ee20aa"});
}

/* jshint ignore:end */
//# sourceMappingURL=bloggor-front.map