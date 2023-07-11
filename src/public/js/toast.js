export default function showToast(title ='Thông báo',message='Thông báo'){
    
    const toastLiveExample = document.getElementById('liveToast')
    document.getElementById('toastTitle').textContent = title;
    document.getElementById('toastMessage').textContent = message;
    const toast = new bootstrap.Toast(toastLiveExample)
    toast.show()
}