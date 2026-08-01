let packName = "My Sample Pack";

let folders = [
{
    name:"The Pack",
    files:[],
    folders:[]
}
];

let currentFolder = folders[0];

let modalAction = null;



const tree = document.getElementById("folderTree");
const fileGrid = document.getElementById("fileGrid");
const dropZone = document.getElementById("dropZone");
const filePicker = document.getElementById("filePicker");
const search = document.getElementById("search");

const title = document.getElementById("packTitle");
const breadcrumbs = document.getElementById("breadcrumbs");


const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalInput = document.getElementById("modalInput");

const modalConfirm = document.getElementById("modalConfirm");
const modalCancel = document.getElementById("modalCancel");





// =================
// MODAL SYSTEM
// =================


function openModal(title,value,callback){

    modal.style.display="flex";

    modalTitle.textContent=title;

    modalInput.style.display="block";

    modalInput.value=value || "";

    modalInput.focus();

    modalAction=callback;

}





function openDelete(callback){

    modal.style.display="flex";

    modalTitle.textContent="Delete this item?";

    modalInput.style.display="none";

    modalAction=callback;

}





function confirmModal(){

    if(modalAction){

        modalAction(
            modalInput.value
        );

    }

    closeModal();

}





modalConfirm.onclick=()=>{

    confirmModal();

};





modalInput.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){

        e.preventDefault();

        confirmModal();

    }

});





modalCancel.onclick=()=>{

    closeModal();

};





function closeModal(){

    modal.style.display="none";

    modalInput.style.display="block";

    modalAction=null;

}








// =================
// RENDER
// =================


function render(){

    tree.innerHTML="";


    folders.forEach(folder=>{

        drawFolder(folder,tree);

    });


    showFiles();


    title.textContent=packName;


    breadcrumbs.textContent =
    packName+" > "+currentFolder.name;

}







// =================
// FOLDER SYSTEM
// =================


function drawFolder(folder,parent){


    let div=document.createElement("div");


    div.className="folder";



    div.innerHTML=`

    <span>
    📁 ${folder.name}
    </span>


    <button class="dots">
    ⋮
    </button>


    <div class="miniMenu">


        <button class="rename">
        Rename
        </button>


        ${
        folder===folders[0]
        ?
        ""
        :
        `
        <button class="delete">
        Delete
        </button>
        `
        }


    </div>

    `;




    div.querySelector("span").onclick=()=>{


        currentFolder=folder;


        render();


    };





    let menu =
    div.querySelector(".miniMenu");





    div.querySelector(".dots").onclick=e=>{


        e.stopPropagation();


        closeMenus();


        menu.style.display="block";


    };





    div.querySelector(".rename").onclick=()=>{


        openModal(

            "Rename Folder",

            folder.name,

            name=>{


                if(name){


                    folder.name=name;


                    render();


                }


            }

        );


    };





    let deleteButton =
    div.querySelector(".delete");



    if(deleteButton){


        deleteButton.onclick=()=>{


            openDelete(()=>{


                deleteFolder(folder);


                if(currentFolder===folder){

                    currentFolder=folders[0];

                }


                render();


            });


        };


    }







    parent.appendChild(div);





    folder.folders.forEach(child=>{


        let box=document.createElement("div");


        box.className="subfolder";


        parent.appendChild(box);



        drawFolder(child,box);


    });



}






function deleteFolder(folder){


    function searchFolders(list){


        for(let i=0;i<list.length;i++){


            if(list[i]===folder){


                list.splice(i,1);


                return true;


            }




            if(searchFolders(list[i].folders)){


                return true;


            }


        }


        return false;


    }



    searchFolders(folders);


}
// =================
// CREATE FOLDER
// =================


document.getElementById("newFolder").onclick=()=>{


    openModal(

        "New Folder",

        "",

        name=>{


            if(name){


                folders.push({

                    name:name,

                    files:[],

                    folders:[]

                });


                render();


            }


        }

    );


};







// =================
// CREATE SUBFOLDER
// =================


document.getElementById("newSubfolder").onclick=()=>{


    openModal(

        "New Subfolder",

        "",

        name=>{


            if(name){


                currentFolder.folders.push({

                    name:name,

                    files:[],

                    folders:[]

                });


                render();


            }


        }

    );


};








// =================
// RENAME PACK
// =================


document.getElementById("renamePack").onclick=()=>{


    openModal(

        "Rename Pack",

        packName,

        name=>{


            if(name){


                packName=name;


                render();


            }


        }

    );


};








// =================
// IMPORT FILES
// =================


document.getElementById("uploadFiles").onclick=()=>{


    filePicker.click();


};





filePicker.onchange=e=>{


    addFiles(e.target.files);


};







dropZone.onclick=()=>{


    filePicker.click();


};






dropZone.ondragover=e=>{


    e.preventDefault();


};






dropZone.ondrop=e=>{


    e.preventDefault();


    addFiles(

        e.dataTransfer.files

    );


};







function addFiles(files){



    [...files].forEach(file=>{


        currentFolder.files.push(file);


    });



    render();


}










// =================
// SHOW FILES
// =================


function showFiles(){


    fileGrid.innerHTML="";



    let term =
    search.value.toLowerCase();






    currentFolder.files

    .filter(file=>


        file.name
        .toLowerCase()
        .includes(term)


    )

    .forEach((file,index)=>{



        let div=document.createElement("div");


        div.className="file";





        div.innerHTML=`

        <i class="fa-solid fa-file-audio"></i>


        <div class="fileName">

        ${file.name}

        </div>



        <button class="dots">

        ⋮

        </button>





        <div class="miniMenu">


            <button class="renameFile">

            Rename

            </button>



            <button class="deleteFile">

            Delete

            </button>



        </div>


        `;







        let menu =
        div.querySelector(".miniMenu");







        div.querySelector(".dots").onclick=e=>{


            e.stopPropagation();


            closeMenus();


            menu.style.display="block";


        };









        div.querySelector(".renameFile").onclick=()=>{


            openModal(

                "Rename Sample",

                file.name,


                name=>{


                    if(name){


                        file.name=name;


                        render();


                    }


                }


            );


        };









        div.querySelector(".deleteFile").onclick=()=>{


            openDelete(()=>{


                currentFolder.files.splice(

                    index,

                    1

                );



                render();



            });



        };









        div.onclick=e=>{



            if(

            e.target.classList.contains("dots")

            )

            return;







            if(file.type.startsWith("audio")){



                let audio=

                document.getElementById(

                    "audioPlayer"

                );





                audio.hidden=false;





                audio.src=

                URL.createObjectURL(file);





                audio.play();



            }



        };







        fileGrid.appendChild(div);



    });



}






search.oninput=showFiles;








// =================
// CLOSE MENUS
// =================


function closeMenus(){


    document
    .querySelectorAll(".miniMenu")
    .forEach(menu=>{


        menu.style.display="none";


    });


}





document.onclick=()=>{


    closeMenus();


};









// =================
// EXPORT ZIP
// =================


document.getElementById("exportPack").onclick=async()=>{


    let zip=new JSZip();





    function addFolder(folder,path){



        let place=

        zip.folder(

            path + folder.name

        );







        folder.files.forEach(file=>{


            place.file(

                file.name,

                file

            );


        });







        folder.folders.forEach(child=>{


            addFolder(

                child,

                path + folder.name + "/"

            );


        });



    }








    folders.forEach(folder=>{


        addFolder(

            folder,

            ""

        );


    });








    let blob=

    await zip.generateAsync({

        type:"blob"

    });








    let link=document.createElement("a");





    link.href=

    URL.createObjectURL(blob);






    link.download=

    packName+".zip";






    link.click();



};







// START APP


render();