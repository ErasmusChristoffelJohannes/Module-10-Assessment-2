// Small helpers shared by the pages

function escapeHtml(text){
    var div = document.createElement("div");
    div.textContent = text == null ? "" : text;
    return div.innerHTML.replace(/"/g, "&quot;");
}

function getInitials(contact){
    var first = (contact.firstname || "").trim().charAt(0);
    var last = (contact.lastname || "").trim().charAt(0);
    return (first + last).toUpperCase() || "?";
}

function avatarHtml(contact, sizeClass){
    var image = "";
    if(contact.avatar){
        var src = rootPath + "controller/uploads/" + encodeURIComponent(contact.avatar);
        image = `<img src="${escapeHtml(src)}" alt=""/>`;
    }
    return `<span class="avatar ${sizeClass || ""}">${escapeHtml(getInitials(contact))}${image}</span>`;
}

// Fall back to the initials underneath when an avatar image fails to load
document.addEventListener("error", function(e){
    if(e.target.tagName === "IMG" && e.target.parentElement.classList.contains("avatar")){
        e.target.remove();
    }
}, true);

function showToast(message, isError){
    var holder = document.getElementById("toastHolder");
    if(!holder){
        holder = document.createElement("div");
        holder.id = "toastHolder";
        holder.className = "toast-container position-fixed bottom-0 start-50 translate-middle-x p-3";
        holder.setAttribute("aria-live", "polite");
        document.body.appendChild(holder);
    }
    var toast = document.createElement("div");
    toast.className = "toast" + (isError ? " is-error" : "");
    toast.setAttribute("role", isError ? "alert" : "status");
    toast.innerHTML = `<div class="toast-body">${escapeHtml(message)}</div>`;
    holder.appendChild(toast);
    new bootstrap.Toast(toast, {delay: 3500}).show();
}

// Lets a page show a confirmation on the page it redirects to
function setFlash(message){
    try {
        sessionStorage.setItem("flash", message);
    } catch(err) {}
}

function showFlash(){
    try {
        var message = sessionStorage.getItem("flash");
        if(message){
            sessionStorage.removeItem("flash");
            showToast(message);
        }
    } catch(err) {}
}

function previewAvatar(input, holderId){
    if(input.files && input.files[0]){
        var holder = document.getElementById(holderId);
        var url = URL.createObjectURL(input.files[0]);
        holder.innerHTML = `<span class="avatar ${holder.dataset.size}"><img src="${url}" alt=""/></span>`;
    }
}
