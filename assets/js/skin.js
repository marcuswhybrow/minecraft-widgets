var Player = {};

Transforms = {
  flipHorizontal: function(context) {
    context.translate(context.canvas.width, 0);
    context.scale(-1, 1);
  }
};

Player = function(minecraftName, scale, onLoadHandler) {
  this.name = minecraftName;
  this.scale = scale;
  this.imageAddress = "http://corsproxy.herokuapp.com/base64/http://s3.amazonaws.com/MinecraftSkins/" + this.name + ".png"
  this.image = new Image();
  this.width = 16 * this.scale;
  this.height = 32 * this.scale;
  this.onLoadHandler = onLoadHandler;
  this.numBodyPartsLoaded = 0;
  this.bodyParts = [];
  this.x = 0;
  this.y = Math.ceil(0.5 * scale);

  this.context = document.createElement('canvas').getContext('2d');

  this._load(function() {

    this.context.canvas.width = 64;
    this.context.canvas.height = 32;

    this.context.drawImage(this.image, 0, 0, 64, 32);

    this.isHelmetHidden = this.isHelmetAllSameColour();

    // Must be same number of BodyPart instances created for "this"
    this.numBodyParts = 1;

    var head = new Player.BodyPart(this, 8, 8, 8, 8),
        body = new Player.BodyPart(this, 20, 20, 8, 12),
        legRight = new Player.BodyPart(this, 4, 20, 4, 12),
        legLeft = new Player.BodyPart(this, 4, 20, 4, 12, { transformHandler: Transforms.flipHorizontal }),
        armRight = new Player.BodyPart(this, 44, 20, 4, 12),
        armLeft = new Player.BodyPart(this, 44, 20, 4, 12, { transformHandler: Transforms.flipHorizontal }),
        helmet = new Player.BodyPart(this, 40, 8, 8, 8, {
          isTransparent: true,
          scale: 1.125
        }),
        helmetBack = new Player.BodyPart(this, 56, 8, 8, 8, {
          isTransparent: true,
          scale: 1.125
        });

    if (this.isHelmetHidden == false)
      this.attachBodyPart(helmetBack, 3.5, -0.5);
    this.attachBodyPart(head, 4, 0);
    this.attachBodyPart(body, 4, 8);
    this.attachBodyPart(legRight, 4, 20);
    this.attachBodyPart(legLeft, 8, 20);
    this.attachBodyPart(armRight, 0, 8);
    this.attachBodyPart(armLeft, 12, 8);
    if (this.isHelmetHidden == false)
      this.attachBodyPart(helmet, 3.5, -0.5);
  });
};
Player.prototype = {
  draw: function(context) {
    for (i in this.bodyParts) {
      this.bodyParts[i].draw(context);
    }
  },

  isHelmetAllSameColour: function() {
    var frontBackAndSides = this.context.getImageData(32, 8, 32, 8);
        topAndBottom = this.context.getImageData(40, 0, 16, 8);

    var i = frontBackAndSides.data.length-4,
        colour = [
          frontBackAndSides.data[0],
          frontBackAndSides.data[1],
          frontBackAndSides.data[2],
          frontBackAndSides.data[3]
        ];

    function equal(a,b) { return !(a<b || b<a); }
    function getColour(data, i) { return [ data[i], data[i+1], data[i+2], data[i+3] ]; }

    while (i >= 0) {
      if (equal(colour, getColour(frontBackAndSides.data, i)) == false)
        return false;
      i -= 4;
    }

    i = topAndBottom.data.length-4;

    while (i >= 0) {
      if (equal(colour, getColour(topAndBottom.data, i)) == false)
        return false;
      i -= 4;
    }

    return true;
  },


  bodyPartLoaded: function() {
    if (++this.numBodyPartsLoaded >= this.numBodyParts) {
      this.onLoadHandler.call(this);
    }
  },

  attachBodyPart: function(bodyPart, largeScaleX, largeScaleY) {
    bodyPart.setOffset(largeScaleX, largeScaleY);
    this.bodyParts.push(bodyPart);
  },

  getX: function() {
    return this.x;
  },

  getY: function() {
    return this.y;
  },

  getImageData: function(x, y, width, height) {
    return this.context.getImageData(x, y, width, height);
  },

  _load: function(onLoadHandler) {
    var _this = this;
    if (this.name && this.name.length > 0) {
      // $.support.cors = true;
      $.ajax({
        url: this.imageAddress + '?breakcache=' + Math.random(),
        success: function(data) {
          _this.image.src = 'data:image/png;base64,' + data;
        },
        error: function(jsxhr, status, error) {
          _this.image.src = 'assets/img/default.png';
        },
        complete: function() {
          _this.image.onload = function() {
            if (typeof onLoadHandler != 'undefined')
              onLoadHandler.call(_this);
          }
        }
      });
    } else {
      this.image.src = 'assets/img/default.png';
      this.image.onload = function() {
        if (typeof onLoadHandler != 'undefined')
          onLoadHandler.call(_this);
      }
    }
  }
};


Player.BodyPart = function(player, x, y, width, height, options) {
  this.player = player;
  this.x = x;
  this.y = y;
  this.offsetX = 0;
  this.offsetY = 0;

  this.data = this.player.getImageData(x, y, width, height);
  this.image = new Image();

  var context = document.createElement('canvas').getContext('2d');

  this.isTransparent = false;
  this.scale = this.player.scale;
  if (typeof options != 'undefined') {
    if (typeof options.transformHandler != 'undefined')
      options.transformHandler(context);

    this.isTransparent = options.isTransparent || false;
    this.scale = options.scale * this.player.scale || this.player.scale;
  }

  this.width = width * this.scale;
  this.height = height * this.scale;

  context.canvas.width = this.width;
  context.canvas.height = this.height;

  var i,
      canvasX = width,
      canvasY = height,
      dataWidth = this.data.width,
      scale = this.scale;

  while(--canvasX >= 0) {
    while(--canvasY >= 0) {
      i = canvasX * 4 + canvasY * 4 * dataWidth;

      if (this.isTransparent == false) {
        context.fillStyle = '#000'
        context.fillRect(canvasX * scale, canvasY * scale, scale, scale);
      }

      context.fillStyle = 'rgba('
        +this.data.data[i]+','
        +this.data.data[i+1]+','
        +this.data.data[i+2]+','
        +this.data.data[i+3]+')';
      context.fillRect(Math.ceil(canvasX * scale), Math.ceil(canvasY * scale), Math.ceil(scale), Math.ceil(scale));
    }
    canvasY = height;
  }

  this.image.src = context.canvas.toDataURL();
  
  var _this = this;
  this.image.onload = function() {
    _this.player.bodyPartLoaded();
  };
};
Player.BodyPart.prototype = {
  draw: function(context) {
    context.drawImage(this.image, this.getX(), this.getY(), this.width, this.height);
  },

  setOffset: function(largeScaleX, largeScaleY) {
    this.offsetX = largeScaleX * this.player.scale;
    this.offsetY = largeScaleY * this.player.scale;
  },

  getX: function() {
    return this.player.getX() + this.offsetX;
  },

  getY: function() {
    return this.player.getY() + this.offsetY;
  }
};




var params = function () {
  var vars = [], hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for(var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}();

var name = params.playername || '',
    scale = Math.floor(params.scale) || 1;

new Player(name, scale, function() {
  var canvas = document.createElement('canvas'),
      context = canvas.getContext('2d');
  
  canvas.width = this.width;
  canvas.height = this.height;

  this.draw(context);
  
  document.body.appendChild(canvas);
});