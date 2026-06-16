document.addEventListener("DOMContentLoaded", function () {
    
    // 1. XỬ LÝ ĐÓNG / MỞ DROPDOWN VÀ XOAY MŨI TÊN
    const selectTrigger = document.querySelector(".select-trigger");
    const selectWrapper = document.querySelector(".custom-select-wrapper");

    if (selectTrigger && selectWrapper) {
        selectTrigger.addEventListener("click", function (e) {
            e.stopPropagation(); // Ngăn chặn sự kiện nổi bọt gây đóng menu lập tức
            selectWrapper.classList.toggle("open");
        });
    }

    // 2. TỰ ĐỘNG CẬP NHẬT CHỮ KHI KHÁCH BẤM CHỌN CÁC Ô CHECKBOX
    const checkboxes = document.querySelectorAll('.option-item input[type="checkbox"]');
    const labelText = document.getElementById('selected-services-text');

    if (checkboxes && labelText) {
        checkboxes.forEach(cb => {
            cb.addEventListener("change", function () {
                let selected = [];
                checkboxes.forEach(item => {
                    if (item.checked) {
                        selected.push(item.value);
                    }
                });

                if (selected.length === 0) {
                    labelText.innerText = "Bấm để chọn các dịch vụ...";
                    labelText.style.color = "#94a3b8";
                } else if (selected.length <= 2) {
                    labelText.innerText = selected.join(', ');
                    labelText.style.color = "#334155";
                } else {
                    labelText.innerText = `Đã chọn ${selected.length} dịch vụ`;
                    labelText.style.color = "#ff708f";
                }
            });
        });
    }

    // Tự động đóng hộp chọn nếu khách click chuột ra ngoài vùng biểu mẫu
    document.addEventListener('click', function (e) {
        if (selectWrapper && !selectWrapper.contains(e.target)) {
            selectWrapper.classList.remove('open');
        }
    });

    // 3. GIỮ LẠI HIỆU ỨNG ĐỔI TRẠNG THÁI ACTIVE TRÊN THANH MENU (NAV PILLS)
    const navPills = document.querySelectorAll(".nav-pill");
    navPills.forEach(pill => {
        pill.addEventListener("click", function() {
            navPills.forEach(p => p.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // 4. XỬ LÝ LƯU GỬI BIỂU MẪU ĐẶT LỊCH AN TOÀN
    const orderForm = document.querySelector(".booking-form") || document.getElementById("orderForm");
    
    if (orderForm) {
        orderForm.addEventListener("submit", function (e) {
            e.preventDefault();

            // Tìm kiếm thông minh dựa trên thuộc tính placeholder để tránh lệch ID giữa HTML và JS
            const nameInput = orderForm.querySelector('input[placeholder*="tên"]');
            const phoneInput = orderForm.querySelector('input[type="tel"]') || orderForm.querySelector('input[placeholder*="thoại"]');
            const addressInput = orderForm.querySelector('input[placeholder*="nhà"]') || orderForm.querySelector('input[placeholder*="chỉ"]');

            const name = nameInput ? nameInput.value.trim() : "Khách hàng";
            const phone = phoneInput ? phoneInput.value.trim() : "";
            const address = addressInput ? addressInput.value.trim() : "Chưa cung cấp";

            // Kiểm tra số điện thoại hợp lệ
            const phoneRegex = /^(0)[0-9]{9}$/;
            if (!phoneRegex.test(phone)) {
                alert("Số điện thoại không đúng cấu trúc hệ thống. Vui lòng kiểm tra lại bạn nhé!");
                return;
            }

            // Gom danh sách các dịch vụ khách đã tick chọn
            let selectedServices = [];
            orderForm.querySelectorAll('.option-item input[type="checkbox"]:checked').forEach(cb => {
                selectedServices.push(cb.value);
            });
            const servicesStr = selectedServices.length > 0 ? selectedServices.join(', ') : "Chưa chọn dịch vụ";

            alert(`🎉 HỆ THỐNG ĐÃ GHI NHẬN ĐƠN HÀNG!\n---------------------------------\nCảm ơn khách hàng: ${name}\nSĐT liên hệ: ${phone}\nDịch vụ yêu cầu: ${servicesStr}\nCơ sở tại chi nhánh Cao Thắng đang điều động shipper qua khu vực: ${address} để thu gom đồ ngay.`);
            
            // Làm sạch form sau khi đặt thành công
            orderForm.reset();
            if (labelText) {
                labelText.innerText = "Bấm để chọn các dịch vụ...";
                labelText.style.color = "#94a3b8";
            }
        });
    }
});
// Hàm đóng/mở thanh Menu Sidebar trên thiết bị di động
function toggleMobileMenu() {
    const menu = document.getElementById('mainNavigation');
    const overlay = document.getElementById('sidebarOverlay');
    
    if(menu && overlay) {
        menu.classList.toggle('open');
        overlay.classList.toggle('open');
    }
}