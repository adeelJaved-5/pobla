// components/Alert.ts
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export const showSuccessAlert = (
  title: string,
  confirmText: string = 'OK'
): Promise<SweetAlertResult> => {
  return Swal.fire({
    position: 'top',
    icon: 'success' as SweetAlertIcon,
    title,
    showConfirmButton: true,
    confirmButtonText: confirmText,
  });
};

export const showWarningAlert = (
  title: string,
  confirmText: string = 'OK'
): Promise<SweetAlertResult> => {
  return Swal.fire({
    position: 'top',
    icon: 'warning' as SweetAlertIcon,
    title,
    showConfirmButton: true,
    confirmButtonText: confirmText,
  });
};

export const showErrorAlert = (
  title: string,
  text: string = ''
): Promise<SweetAlertResult> => {
  return Swal.fire({
    icon: 'error' as SweetAlertIcon,
    title,
    text,
  });
};
