export default function Loading({ status }) {
    if (!status) return null;

    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}
        >
            <div className="text-center text-white">
                <div className="spinner-grow text-light" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">กำลังโหลด...</span>
                </div>
                <p className="mt-3">กำลังโหลด กรุณารอสักครู่...</p>
            </div>
        </div>
    );
}
