// check image, iterate through pixels, extract data (brightness) from each pixel and 
// construct the object from the DataPointGeoTIFF class and push(add) it the corresponding array

function dataFromTIFFtoArray(_img,  _pntsFromTIFF, _scale) {
    _img.loadPixels()
    let step = 2
    console.log(_img.width , _img.height)
    for(let x = 0; x < _img.width; x+=step) {
        for(let y = 0; y < _img.height; y+=step) {
            let [r, g, b] = _img.get(x, y)
            //     // let c = _img.pixels[i*4]

            let brghtnss = ( r + g + b ) / 3
            //     // let x = i % _img.width
            //     // let y = (i-x)/_img.width

            //     // mapping values from x y - longitude and latitude
            let lon = map(x,0, _img.width,180,-180)
            let lat = map(y,0, _img.height,90,-90)
            // log data on the console
            // console.log(lon , lat , r , g , b, brghtnss)
            // creating datapoint object and pushing it to the arraylist in case
            _pntsFromTIFF.push(new DataPointGeoTIFF(lon, lat, brghtnss, _scale ))
        }
    }
    _img.updatePixels()

}
// function iterates through the objects inside the corresponding array 
// and calls the function display(...) from each object
function visualizeDataFromTIFF(_pntsFromTIFF, _visFlag, _c){
    _pntsFromTIFF.forEach(element => {
        if(_visFlag){
            if(element.lat > treePlanter) {
                element.display(_visFlag, _c)
            }} else {
            element.display(_visFlag, _c)

        }
    })
}

function legend() {

    push()
    translate(width/19.2,height/10.8)

    push()
    rectMode(CENTER)
    translate(width - width / 9.5 + 22.5, height - height / 5)
    rotateX(180)
    fill(255)
    rect(0+width/300, 0 + height / 24, width/18, height / 2.7)
    stroke(44, 44, 44, 255)
    noFill()
    strokeWeight(2)
    rect(0+width/300, 0 + height / 24, width/18, height / 2.7)

    pop()

    push()
    translate(width - width / 9, height - height / 4.2)
    fill(40, 121, 53, 255)
    rotateX(180)
    cone(width/256, height / 4)
    pop()

    push()
    translate(width - width / 10 + 45, height - height / 4.2)
    fill(44, 44, 44, 255)
    textFont(myFont)
    textSize(20)
    text('height corresponds'+'\n'+ 'to the quantity',-width/36, 0 + height / 10)
    //text('CO2 Emissions',0, height / 7)
    rotateX(180)
    cylinder(width/256, height / 4)
    pop()

    pop()
}

// a class to store each Pixel as data point
class DataPointGeoTIFF {


  // parameters: lon lat are location values in degrees,  _value corresponds to brightness, and scale the factor affecting the size in the visualization
  constructor( _lon,  _lat,  _value,  _scale){
      this.lon = _lon
      this.lat = _lat
      // value stands for the actual color of the pixel, the function brightness() extracts
      // the 'whiteness' of the pixel
      this.value = _value
      this.loc3D = createVector(0,0,0)
      this.loc2D = createVector(0,0)
      this.scale = _scale
      this.radius = 400 + 5


      // declaring temporal x y z components
      let tX,tY,tZ
      // converting lat lon into spherical xyz components of the loc3D vector  
      tX = this.radius * Math.cos(radians(this.lat) ) * Math.cos(radians(this.lon))
      tY = this.radius * Math.cos(radians(this.lat)) * Math.sin(radians(this.lon))
      tZ = this.radius * Math.sin(radians(this.lat))
      this.loc3D = createVector(
        tX,
        tY,
        tZ
      )



          tX = map(this.lon,-180,180,-ImgWidth/2,ImgWidth/2)
          tY = map(this.lat,90,-90,-ImgHeight/2,ImgHeight/2)
          this.loc2D = createVector(tX,tY)


  }
  // first parameter is a boolean for the visualization style and second one is the display color
  display(isTree,c){

    let pointWeight = map(this.value,0,255,1.2,8) *map(this.value,0,255,1.2,8) * this.scale
      let reforestScale = map(treePlanter,-90,90,0,2)
      let opacity = this.value*this.value * this.scale
    if(this.value>0){

      if(isTree){
        strokeWeight(2)
        stroke(c)
        push()
          fill(c)

          if(threeDviewFlag){
              translate(-this.loc3D.x,this.loc3D.y,this.loc3D.z)}
          else{
              translate(-this.loc2D.x,this.loc2D.y,)}

          rotateX(158.5);
          cone(15,pointWeight)
          pop()


      }else{

        //strokeWeight(pointWeight-reforestScale*50)
        fill(c)
          //stroke(c)
          noStroke()
          push()
          if(threeDviewFlag){
              translate(-this.loc3D.x,this.loc3D.y,this.loc3D.z)}
              else{
          translate(-this.loc2D.x,this.loc2D.y)}

              //sphere(pointWeight/20)

          rotateZ(0);
          rotateX(67.5);
          rotateY(0);
          cylinder(10, pointWeight + pointWeight*(reforestScale*0.7));

        pop()
      }
    }else{
      // do something else  when the value (brightness is 0 or black or no information)

    }

}}
