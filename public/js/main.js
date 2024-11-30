$(() => {
    $(document).on("submit", "#formulario-registro", async function(e) {
        e.preventDefault()
        const formData = new FormData()
        formData.append("foto", fileFoto.files[0])

        fetch("/registro", {
            method: "POST",
            body: formData
        }).then((data) => {
            return data.json();
        }).then(response => {
            alert(response.message);
            listarImagenes();
            $("#formulario-registro")[0].reset();
        })
             
    });

    $(document).on("click",".icon-delete", function() {
        const nombre = $(this).data("img");
        if(confirm("¿Seguro desea eliminar esta imagen?")) {
            fetch(`/imagenes/${nombre}`, {
                method: "DELETE"
            }).then((data) => {
                return data.json();
            }).then(response => {
                listarImagenes();
            }).catch(error => {
                alert("Ocurrió un error en el servidor, intente nuevamente.");
            })
        }
    })

    const obtenerImagenes = () => {
        return new Promise((resolve, reject) => {
            fetch("/imagenes", {
                method: "GET"
            }).then(data => data.json())
            .then(response => resolve(response))
            .catch(error => reject(error))
        })
    }

    const listarImagenes = async () => {
        const imagenes = await obtenerImagenes();
        $("#content-images").html("");
        imagenes.data.forEach(element => {
            $("#content-images").append(`
                <div class='col-4' style="position: relative;">
                    <img src='/public/images/${element}' class='img-thumbnail'>
                    <img src='/public/icons/eliminar.png' class='icon-delete' data-img="${element}">
                </div>    
            `);
        });
    }

    // const listarImagenes = () => {
    //     return fetch("/imagenes", { method: "GET"})
    // }

    listarImagenes();
});