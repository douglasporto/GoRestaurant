import Swal from 'sweetalert2';

export const alertSwalSuccess = (msg: string): void => {
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: msg,
    showConfirmButton: false,
    timer: 1500,
  });
};

export const alertSwalError = (msg: string): void => {
  Swal.fire({
    position: 'center',
    icon: 'error',
    title: msg,
    showConfirmButton: false,
    timer: 1500,
  });
};
