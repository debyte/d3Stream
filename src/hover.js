module.exports = function (config) {
  'use strict';

  return hover;

  function hover($element) {
    var hoverFlag = false;
    var lastTouchTime = 0;

    $element
      .on('mousemove', enableHover)
      .on('touchstart', disableHover);
    enableHover();

    function enableHover(event) {
      if (hoverFlag || new Date() - lastTouchTime < config.hoverDelay) return;
      $element.addClass(config.class.hover);
      hoverFlag = true;
    }

    function disableHover(event) {
      lastTouchTime = new Date();
      if (!hoverFlag) return;
      $element.removeClass(config.class.hover);
      hoverFlag = false;
    }
  }
};
