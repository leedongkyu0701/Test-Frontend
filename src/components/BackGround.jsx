import bgImg from "../assets/bg.jpg";
export default function BackGround() {
    return (
        <div style={{
            width: "100%",
            height: "300px",
            backgroundImage: `url(${bgImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
        }}>
        </div>
    )
}