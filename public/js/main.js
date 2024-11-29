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
                <div class='col-3'>
                    <img src='/public/images/${element}' class='img-thumbnail'>
                </div>    
            `);
        });
    }

    // const listarImagenes = () => {
    //     return fetch("/imagenes", { method: "GET"})
    // }

    listarImagenes();
});