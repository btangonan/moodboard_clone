let controller={init:function(){view.init();view.initPackery();view.is_fullscreen=false;window.URL=window.URL||window.webkitURL},startUpload:function(files){this.fileLength=files.length;this.currentFile=0;view.unsupportedFiles=["\nOnly image files allowed!\n\nThese files were not imported:"];view.initProgress(files.length);let interval=setInterval(function(){let i=controller.currentFile;view.appendImg(window.URL.createObjectURL(files[i]),files[i].type,files[i].name);i++;if(i>=files.length)clearInterval(interval)},10)},makeDraggable:function(itemElem){const draggie=new Draggabilly(itemElem);view.packery.bindDraggabillyEvents(draggie)}};let view={init:function(){this.dropzone=document.querySelector("#drop-zone");this.header=document.querySelector("#drop-zone h1");this.help=document.querySelector("#drop-zone p");this.footer=document.querySelector("#drop-zone footer");this.fullscreen=document.querySelector("#fullscreen");this.fs_filename=document.querySelector("#fs-filename");view.dragTimer;console.log(this.dropzone,this.help,this.header);this.dropzone.ondrop=function(e){e.preventDefault();let dt=e.dataTransfer;view.dropzone.className="panel hidden";view.header.className="hidden";view.help.className="hidden";view.footer.className="hidden";document.ondragover=function(){window.clearTimeout(view.dragTimer);view.dropzone.className="panel";view.header.className="hidden";view.help.className="hidden";view.footer.className="hidden"};document.ondragleave=function(){window.clearTimeout(view.dragTimer);view.dragTimer=window.setTimeout(function(){view.dropzone.className="panel hidden"},85)};if(dt.types&&(dt.types.indexOf?dt.types.indexOf("Files")!=-1:dt.types.contains("Files"))){if(view.is_fullscreen)view.toggle_fullscreen();controller.startUpload(dt.files)}};this.dropzone.ondragover=function(){return false};this.dropzone.ondragleave=function(){return false}},appendImg:function(file,type,name){if(type.match("image.*")){this.newContainer=document.createElement("div");this.newContainer.className="grid-item";this.newImgNameContainer=document.createElement("div");this.newImgNameContainer.className="filename hidden";this.newImgName=document.createElement("span");this.newImgName.innerHTML=name;this.newImg=document.createElement("img");this.newImg.setAttribute("src",file);this.newContainer.onmouseover=function(n){return function(){view.currentImage=this}}(name);this.newImg.onload=function(){window.URL.revokeObjectURL(this.src)};this.newImgNameContainer.append(this.newImgName);this.newContainer.append(this.newImgNameContainer,this.newImg);document.querySelector("#packery-container").append(this.newContainer);this.packery.appended(this.newContainer);controller.makeDraggable(this.newContainer);console.log("adding new image")}else{this.unsupportedFiles.push(`  -  ${name}`)}controller.currentFile++;if(controller.currentFile==controller.fileLength){view.prog.outerHTML="";view.packery.layout();if(this.unsupportedFiles.length>1)alert(view.unsupportedFiles.join("\n"))}else{view.prog.firstChild.innerHTML="Loading... "+controller.currentFile+" / "+controller.fileLength}},initPackery:function(){this.grid=document.querySelector("#packery-container");this.packery=new Packery(this.grid,{itemSelector:".grid-item",percentPosition:true,columnWidth:".grid-item"});this.addKeyListeners()},initProgress:function(){this.prog=document.createElement("div");this.prog.className="prog";this.prog.innerHTML="<p>Loading..."+controller.currentFile+" / "+controller.fileLength+"</p>";document.querySelector("body").appendChild(this.prog);this.prog=document.querySelector(".prog")},toggle_fullscreen:function(){if(!view.is_fullscreen&&view.currentImage){this.fullscreen.className="";this.fullscreen.style.backgroundImage=`url(${view.currentImage.children[1].src})`;view.is_fullscreen=true;console.log(view.currentImage.children[1].src)}else{this.fullscreen.className="hidden";view.is_fullscreen=false}},addKeyListeners:function(){document.onkeydown=function(e){let is_reLayout=false;switch(e.keyCode){case 49:view.col_width=1;is_reLayout=true;break;case 50:view.col_width=2;is_reLayout=true;break;case 51:view.col_width=3.00001;is_reLayout=true;break;case 52:view.col_width=4;is_reLayout=true;break;case 53:view.col_width=5;is_reLayout=true;break;case 54:view.col_width=6.00001;is_reLayout=true;break;case 55:view.col_width=7;is_reLayout=true;break;case 56:view.col_width=8;is_reLayout=true;break;case 57:view.col_width=9.00001;is_reLayout=true;break;case 67:if(view.currentImage)navigator.clipboard.writeText(view.currentImage.children[0].firstChild.innerHTML).then(function(){console.log("Copied "+view.currentImage.children[0].firstChild.innerHTML)});break;case 68:view.packery.remove(view.currentImage);if(view.is_fullscreen)view.toggle_fullscreen();view.currentImage="";if(view.packery.getItemElements().length>0){is_reLayout=true}else{view.dropzone.className="panel";view.header.className="";view.help.className="";view.footer.className=""}break;case 70:view.toggle_fullscreen();view.fs_filename.className="hidden";break;case 73:if(view.currentImage){view.currentFileName=view.currentImage.children[0];if(view.is_fullscreen){view.fs_filename.firstChild.innerHTML=view.currentFileName.firstChild.innerHTML;view.fs_filename.className=view.fs_filename.className==="hidden"?"":"hidden"}else{view.currentFileName.className=view.currentFileName.className==="filename hidden"?"filename":"filename hidden"}}break;case 72:let dropzone=document.querySelector("#drop-zone");if(!view.help.classList.contains("hidden")){view.header.className="hidden";view.help.className="hidden";view.footer.className="hidden";if(view.packery.getItemElements().length>0)dropzone.className="panel hidden"}else{view.header.className="";view.help.className="";view.footer.className="";view.packery.getItemElements().length>0?dropzone.className="panel help":dropzone.className="panel"}break}if(is_reLayout&&!view.is_fullscreen){document.documentElement.style.cssText=`--grid-cols: ${view.col_width||4}`;view.packery.layout()}}}};controller.init();