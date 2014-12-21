QUnit.test("i18n simple", function (assert) {
  $.i18n.setup({
    simpleKey1 : "simpleValue1",
    simpleKey2 : "simpleValue2",
    simpleKey3 : "simpleValue3"
  });
  assert.equal($.i18n.t("simpleKey1"), "simpleValue1");
  assert.equal($.i18n.t("simpleKey2"), "simpleValue2");
  assert.equal($.i18n.t("simpleKey3"), "simpleValue3");
});

QUnit.test("i18n interpolation", function (assert) {
  $.i18n.setup({
    "key1" : "no results...",
    "key2:arg1" : "result: {arg1}",
    "key3:arg1:arg2" : "result with {arg1} and {arg2}"
  });
  assert.equal($.i18n.t("key1"), "no results...");
  assert.equal($.i18n.t("key2:foo"), "result: foo");
  assert.equal($.i18n.t("key3:foo:bar"), "result with foo and bar");
});

QUnit.test("repeated keys should throw error on setup", function (assert) {
  var callSetup = function () {
    $.i18n.setup({
      "key1:arg1" : "result: {arg1}",
      "key1:arg1:arg2" : "result with {arg1} and {arg2}"
    });
  };
  assert.throws(callSetup);
});

QUnit.test("wrong number args should throw error", function (assert) {
  $.i18n.setup({
    "key1" : "no results...",
    "key2:arg1" : "result: {arg1}",
    "key3:arg1:arg2" : "result with {arg1} and {arg2}"
  });
  assert.throws(function () { $.i18n.t("key1:a"); });
  assert.throws(function () { $.i18n.t("key2"); });
  assert.throws(function () { $.i18n.t("key3:foo"); });
  assert.throws(function () { $.i18n.t("key3:foo:bar:gaz"); });
});

QUnit.test("i18n escape : and \\ in key", function (assert) {
  $.i18n.setup({
    "noargs\\:this is no arg" : "no results...",
    "noargs:this is an arg" : "result: {this is an arg}",

    "2.noargs\\\\:this is an arg" : "2.result: {this is an arg}",
    "3.noargs\\\\\\:this is no arg" : "3.no results..."
  });

  assert.equal($.i18n.t("noargs\\:this is no arg"), "no results...");
  assert.equal($.i18n.t("noargs:this is a pretty arg"), "result: this is a pretty arg");
  assert.throws(function () { $.i18n.t("noargs"); });

  assert.equal($.i18n.t("2.noargs\\\\:this is a sad arg"), "2.result: this is a sad arg");
  assert.equal($.i18n.t("3.noargs\\\\\\:this is no arg"), "3.no results...");
});

QUnit.test("i18n escaped interpolation in value", function (assert) {
  $.i18n.setup({
    "myKey:arg" : "the value of \\{arg\\} is: \\\\{arg}"
  });

  assert.equal($.i18n.t("myKey:foo"), "the value of {arg} is: \\foo");
});