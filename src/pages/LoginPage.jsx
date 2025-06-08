import { useState } from "react"
import AlertMessage from "../items/AlertMessage"
import Loading from "../items/Loading"
import { login, resetPassword, register } from "../data/UserAuth"

export default function LoginPage() {
    const [isLoad, setLoad] = useState(false)
    const [alertType, setAlertType] = useState("")
    const [alertMsg, setAlertMsg] = useState("")

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState("")
    const [isLogin, setIsLogin] = useState(true)
    const [showPass, setShowPass] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (email === '' || password === '') throw new Error("กรุณากรอกอีเมลและรหัสผ่าน")
            setLoad(true)
            if (isLogin) {
                await login(email, password)
            } else {
                await register(email, password)
            }
        } catch (err) {
            setAlertType("error")
            setAlertMsg(err.message)
        } finally {
            setLoad(false)
            setTimeout(() => {
                setAlertMsg("")
                setAlertType("")
            }, 3000)
        }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault()
        try {
            if (email === '') throw new Error("กรุณากรอกอีเมลเพื่อส่งลิงก์รีเซ็ตรหัสผ่าน")
            setLoad(true)
            await resetPassword(email)
            setAlertMsg("ส่งลิงก์รีเซ็ตรหัสผ่านเรียบร้อยแล้ว")
            setAlertType("success")
        } catch (err) {
            setAlertType("error")
            setAlertMsg(err.message)
        } finally {
            setLoad(false)
            setTimeout(() => {
                setAlertMsg("")
                setAlertType("")
            }, 3000)
        }
    }

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="card p-4 shadow mt-5" style={{ maxWidth: "400px", width: "100%" }}>
                <h2 className="text-center mb-4">{isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">อีเมล</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="กรอกอีเมลของคุณ"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">รหัสผ่าน</label>
                        <div className="input-group">
                            <input
                                type={showPass ? "text" : "password"}
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="กรอกรหัสผ่าน"
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowPass(!showPass)}
                            >
                                {showPass ? "ซ่อน" : "แสดง"}
                            </button>
                        </div>
                    </div>
                    <div className="mb-3 text-end">
                        <a
                            type="button"
                            className="btn btn-link p-0"
                            onClick={handleResetPassword}
                        >
                            ลืมรหัสผ่าน?
                        </a>
                    </div>
                    <div className="d-grid mb-3">
                        <button type="submit" className="btn btn-primary">
                            {isLogin ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
                        </button>
                    </div>
                    <div className="text-center">
                        <a
                            type="button"
                            className="btn btn-link"
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? "ยังไม่มีบัญชี? สมัครสมาชิก" : "มีบัญชีแล้ว? เข้าสู่ระบบ"}
                        </a>
                    </div>
                </form>
                <AlertMessage type={alertType} msg={alertMsg} />
                <Loading status={isLoad} />
            </div>
        </div>
    )
}
