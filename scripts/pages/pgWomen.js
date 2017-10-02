const extend = require('js-base/core/extend');
const PgWomenDesign = require('ui/ui_pgWomen');
const pageContextPatch = require("../context/pageContextPatch");
const SvipeViewTemplatePage = require("pages/pgWomenSwipePage");
const globalSvipeViewList = require("lib/swipeViewList");
const SwipeView = require("sf-core/ui/swipeview");
const Router = require("sf-core/ui/router");
const System = require('sf-core/device/system');
const flexProps = ["flexGrow", "flexDirection", "alignItems", "justifyContent"];

const PgWomen = extend(PgWomenDesign)(
  // Constructor
  function(_super) {
    _super(this);
    this.onShow = onShow.bind(this, this.onShow.bind(this));
    this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
    this.flHeaderLeft.onTouchEnded = function() {
      Router.goBack();
    };

    this.subscribeContext = function(e) {
      if (e.type == "new-styles") {
        Object.keys(e.data).forEach(function(key) {
          if (flexProps.some(function(prop) { return prop == key })) {
            this.layout[key] = e.data[key];
          }
          else {
            this[key] = e.data[key];
          }
        }.bind(this));
      }
    };
    initDotIndicator(this);
    pageContextPatch(this, "pgWomen");
    loadUI.call(this);
  });

/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 * @param {function} superOnShow super onShow function
 * @param {Object} parameters passed from Router.go function
 */
function onShow(superOnShow) {
  const page = this;
  superOnShow();

  if (System.OS === "iOS") {
    page.flStatusBarBg.height = page.statusBar.height;
  }
  else {
    page.layout.removeChild(page.flStatusBarBg);
  }
}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
  superOnLoad();
}


function loadUI() {
  const json = require("../sample-data/customerProfile.json");
  var list = json.whishlist;
  globalSvipeViewList.setList(list);
  globalSvipeViewList.setActiveIndex(0);
  var swipeView = new SwipeView({
    page: this,
    flexGrow: 1,
    pages: [SvipeViewTemplatePage, SvipeViewTemplatePage, SvipeViewTemplatePage, SvipeViewTemplatePage],
    onPageSelected: onChildPageChanged.bind(this),
    marginBottom: 18
  });
  this.flSwipe.addChild(swipeView);

}

function initDotIndicator(page) {
  page.dotIndicator.size = 4;
}


function onChildPageChanged(index) {
  console.log("SelectedIndeex_> " + index);
  globalSvipeViewList.setActiveIndex(index);
  this.dotIndicator.currentIndex = index;
}

module && (module.exports = PgWomen);
