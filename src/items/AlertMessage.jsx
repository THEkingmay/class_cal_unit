import { useEffect, useRef } from "react";
import './Alert.css';

export default function AlertMessage({ type, msg }) {
    const modalRef = useRef();
    const modalInstance = useRef(null);

    useEffect(() => {
        if (!msg || !modalRef.current) return;

        modalInstance.current = new window.bootstrap.Modal(modalRef.current, {
            backdrop: 'static',
            keyboard: false
        });

        modalInstance.current.show();

        const timer = setTimeout(() => {
            modalInstance.current?.hide();

            // ลบ backdrop เผื่อค้าง
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) backdrop.remove();
        }, 2000); // ตั้งเวลา 2 วินาที

        return () => clearTimeout(timer); // ล้าง timer ถ้า component หายหรือ msg เปลี่ยน
    }, [msg]);

    if (!msg) return null;

    return (
        <div>
            <div
                className="modal fade alert-message"
                ref={modalRef}
                tabIndex="-1"
                role="dialog"
            >
                <div className="modal-dialog modal-dialog-centered modal-sm" role="document">
                    <div className="modal-content">
                        <div className="modal-body text-center p-lg-4">
                            {type === "error" ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                                    <circle className="path circle" fill="none" stroke="#db3646" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1" />
                                    <line className="path line" fill="none" stroke="#db3646" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3" />
                                    <line className="path line" fill="none" stroke="#db3646" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                                    <circle className="path circle" fill="none" stroke="#198754" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1" />
                                    <polyline className="path check" fill="none" stroke="#198754" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 " />
                                </svg>
                            )}

                            <h4 className={`mt-3 ${type === "error" ? "text-danger" : "text-success"}`}>
                                {type === "error" ? "Error!" : "Success!"}
                            </h4>
                            <p className="mt-3">{msg}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
