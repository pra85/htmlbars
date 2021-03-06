import { hooks as defaultHooks } from "../htmlbars-runtime";
import { merge } from "../htmlbars-util/object-utils";
// import { manualElement } from "../htmlbars-runtime/render";
import { compile } from "../htmlbars-compiler/compiler";
// import { hostBlock } from "../htmlbars-runtime/hooks";
import { equalTokens } from "../htmlbars-test-helpers";
import DOMHelper from "../dom-helper";

var hooks, helpers, partials, env;

function registerHelper(name, callback) {
  helpers[name] = callback;
}

function commonSetup() {
  hooks = merge({}, defaultHooks);
  hooks.keywords = merge({}, defaultHooks.keywords);
  helpers = {};
  partials = {};

  env = {
    dom: new DOMHelper(),
    hooks: hooks,
    helpers: helpers,
    partials: partials,
    useFragmentCache: true
  };
}

QUnit.module("htmlbars-runtime: hooks", {
  beforeEach: commonSetup
});

test("inline hook correctly handles false-like values", function() {

  registerHelper('get', function(params) {
    return params[0];
  });

  var object = { val: 'hello' };
  var template = compile('<div>{{get val}}</div>');
  var result = template.render(object, env);

  equalTokens(result.fragment, '<div>hello</div>');

  object.val = '';

  result.rerender();

  equalTokens(result.fragment, '<div></div>');

});

test("inline hook correctly handles false-like values", function() {

  registerHelper('get', function(params) {
    return params[0];
  });

  var object = { val: 'hello' };
  var template = compile('<div>{{get val}}</div>');
  var result = template.render(object, env);

  equalTokens(result.fragment, '<div>hello</div>');

  object.val = '';

  result.rerender();

  equalTokens(result.fragment, '<div></div>');

});

test("createChildScope hook creates a new object for `blocks`", function() {
  let scope = env.hooks.createFreshScope();
  let child = env.hooks.createChildScope(scope);

  let parentBlock = function() {};
  env.hooks.bindBlock(env, scope, parentBlock, 'inherited');
  strictEqual(scope.blocks.inherited, parentBlock);
  strictEqual(child.blocks.inherited, parentBlock);

  let childBlock = function() {};
  env.hooks.bindBlock(env, child, childBlock, 'notInherited');
  strictEqual(scope.blocks.notInherited, undefined);
  strictEqual(child.blocks.notInherited, childBlock);
});

test("range redirect sends empty test", function() {
  // For a redirect to component
  let oldComponentHook = env.hooks.component;
  let oldClassify = env.hooks.classify;

  env.hooks.component = function(morph, env, scope, path, params) {
    equal(params.length, 0, 'params is empty');
  };
  env.hooks.classify = function() {
    return 'component';
  };

  // Test body
  let scope = env.hooks.createFreshScope();

  env.hooks.range(null, env, scope, 'component-path', [], {});

  env.hooks.classify = oldClassify;
  env.hooks.component = oldComponentHook;
});
