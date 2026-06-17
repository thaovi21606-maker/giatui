document.addEventListener("DOMContentLoaded", function () {
    
    // 1. XỬ LÝ ĐÓNG / MỞ DROPDOWN (Chạy ngầm dự phòng)
    const selectTrigger = document.querySelector(".select-trigger");
    const selectWrapper = document.querySelector(".custom-select-wrapper");

    if (selectTrigger && selectWrapper) {
        selectTrigger.addEventListener("click", function (e) {
            // Chỉ chạy nếu HTML không có sẵn sự kiện onclick
            if (!selectTrigger.hasAttribute('onclick')) {
                e.stopPropagation(); 
                selectWrapper.classList.toggle("open");
            }
        });
    }

    // 2. TỰ ĐỘNG CẬP NHẬT CHỮ KHI TICK CHỌN DỊCH VỤ (Chạy ngầm dự phòng)
    const checkboxes = document.querySelectorAll('.option-item input[type="checkbox"]');
    const labelText = document.getElementById('selected-services-text');

    if (checkboxes && labelText) {
        checkboxes.forEach(cb => {
            cb.addEventListener("change", function () {
                if (!cb.hasAttribute('onchange')) {
                    updateSelectedText(); // Gọi hàm cập nhật chung
                }
            });
        });
    }

    // Tự động đóng hộp chọn dropdown nếu khách click chuột ra ngoài
    document.addEventListener('click', function (e) {
        if (selectWrapper && !selectWrapper.contains(e.target)) {
            selectWrapper.classList.remove('open');
        }
    });

    // 3. HIỆU ỨNG ĐỔI TRẠNG THÁI ACTIVE TRÊN THANH MENU
    const navPills = document.querySelectorAll(".nav-pill");
    navPills.forEach(pill => {
        pill.addEventListener("click", function() {
            navPills.forEach(p => p.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // 4. XỬ LÝ GỬI FORM VỀ FORMSPREE KHÔNG BỊ CHUYỂN TRANG
    const orderForm = document.querySelector(".booking-form");
    
    if (orderForm) {
        orderForm.addEventListener("submit", function (e) {
            e.preventDefault(); // Chặn hành vi load lại trang mặc định

            const phoneInput = orderForm.querySelector('input[name="so_dien_thoai"]');
            const phone = phoneInput ? phoneInput.value.trim() : "";
            
            // Validate số điện thoại (bắt đầu bằng số 0, đủ 10 số)
            const phoneRegex = /^(0)[0-9]{9}$/;
            if (!phoneRegex.test(phone)) {
                alert("Số điện thoại không đúng cấu trúc hệ thống. Vui lòng kiểm tra lại bạn nhé!");
                return; 
            }

            // Đổi hiệu ứng nút thành Đang gửi...
            const submitBtn = orderForm.querySelector('.submit-order-final-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang gửi...';
            submitBtn.disabled = true;

            // Gom dữ liệu form
            const formData = new FormData(orderForm);

            // Gửi ngầm qua Formspree
            fetch(orderForm.action, {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Thành công
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    
                    // LẤY DỮ LIỆU KHÁCH VỪA NHẬP TỪ FORM
                    const hoTen = formData.get('ho_ten');
                    const soDienThoai = formData.get('so_dien_thoai');
                    const diaChi = formData.get('dia_chi');
                    const tgLay = formData.get('thoi_gian_lay');
                    const tgGiao = formData.get('thoi_gian_giao');
                    const ghiChu = formData.get('ghi_chu') || 'Không có';
                    
                    // Lấy danh sách dịch vụ đã tích chọn
                    const checkedBoxes = orderForm.querySelectorAll('.option-item input[type="checkbox"]:checked');
                    let dsDichVu = [];
                    checkedBoxes.forEach(cb => {
                        if(cb.nextElementSibling) {
                            dsDichVu.push(cb.nextElementSibling.textContent.trim());
                        } else {
                            dsDichVu.push(cb.value);
                        }
                    });
                    const txtDichVu = dsDichVu.length > 0 ? dsDichVu.join(', ') : 'Chưa chọn (Trao đổi khi gọi điện)';

                    // Hàm định dạng lại thời gian (YYYY-MM-DDTHH:mm -> HH:mm DD/MM/YYYY)
                    const formatTime = (timeStr) => {
                        if (!timeStr) return '';
                        const d = new Date(timeStr);
                        return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} ngày ${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()}`;
                    };

                    // IN DỮ LIỆU RA KHUNG THÔNG BÁO VÀ HIỂN THỊ
                    const successDiv = document.getElementById('success-notification');
                    
                    if (successDiv) {
                        successDiv.innerHTML = `
                            <h3><i class="fa-solid fa-circle-check"></i> ĐẶT LỊCH THÀNH CÔNG!</h3>
                            <p class="notify-desc">Cảm ơn <strong>${hoTen}</strong>. Chúng tôi sẽ sớm liên hệ qua SĐT <strong>${soDienThoai}</strong> để xác nhận. Dưới đây là thông tin đơn hàng:</p>
                            <ul>
                                <li><strong>Họ và tên:</strong> ${hoTen}</li>
                                <li><strong>Số điện thoại:</strong> ${soDienThoai}</li>
                                <li><strong>Địa chỉ nhận đồ:</strong> ${diaChi}</li>
                                <li><strong>Dịch vụ chọn:</strong> ${txtDichVu}</li>
                                <li><strong>Thời gian lấy đồ:</strong> <span style="color:#E11D48; font-weight:600">${formatTime(tgLay)}</span></li>
                                <li><strong>Thời gian giao lại:</strong> <span style="color:#059669; font-weight:600">${formatTime(tgGiao)}</span></li>
                                <li><strong>Ghi chú:</strong> ${ghiChu}</li>
                            </ul>
                            <button class="btn-close-notify" id="btn-reset-form">Tạo Đơn Hàng Mới</button>
                        `;

                        // Lấy thẻ tiêu đề h3 của form để ẩn đi cùng với form
const formTitle = orderForm.previousElementSibling;

// Ẩn Form và Tiêu đề đi, hiện thông báo lên chiếm trọn không gian
orderForm.style.display = 'none';
if (formTitle && formTitle.tagName === 'H3') formTitle.style.display = 'none';
successDiv.style.display = 'block';

// Cuộn màn hình tới phần thông báo
successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

// Xử lý nút "Tạo đơn mới" để quay lại form
document.getElementById('btn-reset-form').addEventListener('click', function() {
    successDiv.style.display = 'none';
    orderForm.style.display = 'block';
    if (formTitle && formTitle.tagName === 'H3') formTitle.style.display = 'flex'; // Hiện lại tiêu đề form
});
                    } else {
                        // Dự phòng nếu khách chưa chèn mã HTML của div success-notification
                        alert("🎉 HỆ THỐNG ĐÃ GHI NHẬN ĐƠN HÀNG!\nCửa hàng sẽ sớm liên hệ qua số điện thoại với bạn để xác nhận lịch thu gom đồ nhé.");
                    }
                    
                    // Reset form và chữ hiển thị dịch vụ
                    orderForm.reset();
                    if (labelText) {
                        labelText.innerText = "Bấm để chọn các dịch vụ...";
                        labelText.style.color = "#94a3b8";
                    }
                } else {
                    // Bị lỗi từ máy chủ
                    alert("Ôi! Có lỗi xảy ra khi kết nối máy chủ gửi đơn. Vui lòng thử lại sau.");
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }
            })
            .catch(error => {
                // Lỗi mạng internet
                alert("Lỗi kết nối mạng. Vui lòng kiểm tra lại đường truyền internet của bạn!");
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }
});

/* =========================================
   CÁC HÀM TOÀN CỤC HỖ TRỢ GIAO DIỆN HTML CŨ
   ========================================= */

// Hàm mở dropdown menu dành cho thuộc tính onclick="toggleDropdown(event)"
function toggleDropdown(event) {
    if(event) event.stopPropagation();
    const selectWrapper = document.querySelector(".custom-select-wrapper");
    if(selectWrapper) {
        selectWrapper.classList.toggle("open");
    }
}

// Hàm cập nhật chữ dành cho thuộc tính onchange="updateSelectedText()"
function updateSelectedText() {
    const checkboxes = document.querySelectorAll('.option-item input[type="checkbox"]');
    const labelText = document.getElementById('selected-services-text');
    
    if (checkboxes && labelText) {
        let selected = [];
        checkboxes.forEach(item => {
            if (item.checked) {
                // Ưu tiên lấy value, nếu value bị sai thì lấy chữ kế bên ô tick
                let val = item.value;
                if (val === "Giặt Gấu Bông / Thú Nhồi Bông" && item.nextElementSibling) {
                    val = item.nextElementSibling.textContent.trim();
                }
                selected.push(val);
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
    }
}

// Hàm đóng/mở thanh Menu Sidebar trên Mobile
function toggleMobileMenu() {
    const menu = document.getElementById('mainNavigation');
    const overlay = document.getElementById('sidebarOverlay');
    
    if(menu && overlay) {
        menu.classList.toggle('open');
        overlay.classList.toggle('open');
    }
}