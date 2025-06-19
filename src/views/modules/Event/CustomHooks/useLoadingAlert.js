import Swal from "sweetalert2";// Adjust the path to your loader image
import { useMyContext } from '../../../../Context/MyContextProvider';

const useLoadingAlert = () => {
    const {loader} = useMyContext();
    const showLoading = (progress = 0) => {
        return Swal.fire({
            title: "Processing",
            text: progress === 0 ? "Processing will start soon. Please wait..." : "Processing...",
            html: `
                <div style="text-align: center;">
                    <img src=${loader} style="width: 10rem; display: block; margin: 0 auto;"/>
                    <div class="spinner-border text-primary mt-4" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            `,
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: false,
            customClass: {
                htmlContainer: 'swal2-html-container-cutom'
            },

        });
    };
}

export default useLoadingAlert
