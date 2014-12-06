/* globals: define, require, this, console  */

define(['jquery', 'd3', './util'], function($, d3, util){

  var exports = {};

  if(!window.d3){
    window.d3 = d3;
  }
  require(['epoch'], function(epoch){

    /**
     *
     * config.radius
     * (optional) config.girth
     * (optional) config.expand
     * config.width
     * config.height
     * config.el
     * config.labels
     * config.data
     */
    exports.Donut = function(config){

      if((typeof config === "undefined") || (typeof config !== "object")){
        throw new Error("No config object set");
      }

      var that = this;
      this.config = config;
      this.config.girth = config.girth || 40;
      this.config.expand = config.expand || 10;

      this.pie = d3.layout.pie()
                 .sort(null);

      this.arc = d3.svg.arc()
                 .innerRadius(config.radius - config.girth)
                 .outerRadius(config.radius);

      this.bigarc = d3.svg.arc()
                    .innerRadius(config.radius - config.girth)
                    .outerRadius(config.radius + config.expand);


      this.slices = d3.select(config.el).append("svg")
                    .attr("width", config.width)
                    .attr("height", config.height)
                    .append("g")
                    .attr("class", "slices")
                    .attr("transform", "translate(" + config.width / 2 + "," + config.height / 2 + ")");


      this.changeWidth = function(path, arc){
        d3.select(path)
        .transition()
        .duration(300)
        .attr("d", arc);
      };

      this.inflate = function(path){
        this.changeWidth(path, this.bigarc);
      };

      this.deflate = function(path){
        this.changeWidth(path, this.arc);
      };

      this.slice = this.slices.selectAll("path")
                  .data(this.pie(config.data))
                   .enter().append("path")
                   .attr('class', function(d, i){
                     //console.log("PATH CLASS");
                     return that.config.labels[i];
                   })
                   .attr('stroke', '#fff') // margen blanco en donut
                   .attr('stroke-width', '6') // margen blanco en donut
                   .attr("d", this.arc)
                   .on("mouseover", function(d, i) {
                     var path = this;
                     that.inflate(path);
                     that.fire('mouseover', {target: this, segment:d, index: i});
                   })
                   .on("mouseout", function(d, i) {
                     var path = this;
                     that.deflate(path);
                     that.fire('mouseout', {target: this, segment:d, index: i});

                   })
                   .on("click", function(d, i){
                     //debugger;
                     that.fire('click', {target: this, segment:d, index: i});
                   });
    };

    util.augment(exports.Donut,util.EventEmitter);

    exports.Donut.prototype.update = function(config){
      this.config.labels = config.labels;
      this.config.data = config.data;
      this.slice.data(this.pie(config.data))
      .attr("d", this.arc);
    };

    /**
     *
     * config.radius
     * config.width
     * config.height
     * config.el
     * config.labels
     * config.data
     */
    exports.DoubleDonut = function(config){
      var that = this;
      if((typeof config === "undefined") || (typeof config !== "object")){
        throw new Error("No config object set");
      }

      var pie = d3.layout.pie()
                .sort(null);

      var innerarc = d3.svg.arc()
                     .innerRadius(config.radius - 80)
                     .outerRadius(config.radius - 40);

      var innerbigarc = d3.svg.arc()
                        .innerRadius(config.radius - 100)
                        .outerRadius(config.radius - 40);


      var outerarc = d3.svg.arc()
                     .innerRadius(config.radius - 40)
                     .outerRadius(config.radius);

      var outerbigarc = d3.svg.arc()
                        .innerRadius(config.radius - 40)
                        .outerRadius(config.radius + 10);


      var svg = d3.select(config.el).append("svg")
                .attr("width", config.width)
                .attr("height", config.height);

      var innerslices = svg
                        .append("g")
                        .attr("class", "slices")
                        .attr("transform", "translate(" + config.width / 2 + "," + config.height / 2 + ")");

      var outerslices = svg
                        .append("g")
                        .attr("class", "slices")
                        .attr("transform", "translate(" + config.width / 2 + "," + config.height / 2 + ")");


      this.changeWidth = function(path, arc){
        d3.select(path)
        .transition()
        .duration(300)
        .attr("d", arc);
      };
      
      this.inflateInner = function(path){
        this.changeWidth(path, innerbigarc);
      };

      this.deflateInner = function(path){
        this.changeWidth(path, innerarc);
      };

      this.inflateOuter = function(path){
        this.changeWidth(path, outerbigarc);
      };

      this.deflateOuter = function(path){
        this.changeWidth(path, outerarc);
      };

     
      var innerslice = innerslices.selectAll("path")
                       .data(pie(config.data[0]))
                       .enter().append("path")
                       .attr('class', function(d, i){
                         return config.labels[0][i];
                       })
                       .attr('stroke', '#fff') // margen blanco en donut
                       .attr('stroke-width', '6') // margen blanco en donut
                       .attr("d", innerarc)
                       .on("mouseover", function(d, i) {
                         var path = this;
                         that.inflateInner(path);
                         var gpath = $(path).parent().siblings().find('path').get(i);
                         that.inflateOuter(gpath);

                         that.fire('mouseover', {target: this, segment:d, index: i, inner: true});
                       })
                       .on("mouseout", function(d, i) {
                         var path = this;
                         that.deflateInner(path);
                         var gpath = $(path).parent().siblings().find('path').get(i);
                         that.deflateOuter(gpath);

                         that.fire('mouseout', {target: this, segment:d, index: i, inner: true});
                       })
                       .on("click", function(d, i){

                         that.fire('click', {target: this, segment:d, index: i, inner: true});
                       });

      var outerslice = outerslices.selectAll("path")
                       .data(pie(config.data[1]))
                       .enter().append("path")
                      .attr('class', function(d, i){
                         return config.labels[1][i];
                       })
                       .attr('stroke', '#fff') // margen blanco en donut
                       .attr('stroke-width', '6') // margen blanco en donut
                       .attr("d", outerarc)
                       .on("mouseover", function(d, i) {
                         var path = this;
                         that.inflateOuter(path);
                         var gpath = $(path).parent().siblings().find('path').get(i);
                         that.inflateInner(gpath);

                         that.fire('mouseover', {target: this, segment:d, index: i, inner: false});
                       })
                       .on("mouseout", function(d, i) {
                         var path = this;
                         that.deflateOuter(path);
                         var gpath = $(path).parent().siblings().find('path').get(i);
                         that.deflateInner(gpath);

                         that.fire('mouseout', {target: this, segment:d, index: i, inner: false});
                       })
                       .on("click", function(d, i){
                         that.fire('click', {target: this, segment:d, index: i, inner: false});
                       });
    };
    util.augment(exports.DoubleDonut, util.EventEmitter);


    /**
     *
     * config.el
     * config.data
     */
    exports.Bars = function(config){
      if((typeof config === "undefined") || (typeof config !== "object")){
        throw new Error("No config object set");
      }

      //debugger;
      var that = this;
      this.config = config;

      $(this.config.el).epoch({
        type: 'bar',
        data: this.config.data,
        width: this.config.width,
        height: this.config.height
      });

      //debugger;
      $(this.config.el).find('svg rect').on('click', function(e){

        var svg = $(that.config.el).find("svg");
        var child = Math.floor(util.nthitem(svg, e.target, 'rect') / that.config.data.length);
        that.raise('click', child, svg, e.target, e);
      });
    };
    util.augment(exports.Bars, util.EventEmitter);

    /**
     *
     * config.el
     * config.data
     */
    exports.Lines = function(config){
      if((typeof config === "undefined") || (typeof config !== "object")){
        throw new Error("No config object set");
      }

      //debugger;
      var that = this;
      this.config = config;

      $(this.config.el).epoch({
        type: 'line',
        data: this.config.data,
        width: this.config.width,
        height: this.config.height
      });

      //debugger;
      $(this.config.el).find('svg line').on('click', function(e){

        var svg = $(that.config.el).find("svg");
        var child = Math.floor(util.nthitem(svg, e.target, 'line') / that.config.data.length);
        that.raise('click', child, svg, e.target, e);
      });
    };
    util.augment(exports.Lines, util.EventEmitter);

  });

  return exports;

});