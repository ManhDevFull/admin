import { appInfo } from "../constants/appInfos";

const Loader = () => {
  return (
    <div className="loader">
      <div className="box"></div>
      <div className="box"></div>
      <div className="box"></div>
      <div className="box"></div>
      <div className="logo">
        <svg
          width="43"
          height="48"
          viewBox="0 0 43 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.7846 3.97371L41.5692 14.9803V36.9934L20.7846 47.9999L0 36.9934V14.9803L20.7846 3.97371Z"
            fill="#009ED8"
          />
          <path
            d="M11.1401 31.6875V12.0823C13.3766 9.53186 15.4221 11.0196 16.1653 12.0823V21.2069L39.268 0.0992135C42.4323 -0.49444 42.9237 1.72076 42.7739 2.90257L11.1401 31.6875Z"
            fill="#0ACF83"
          />
          <path
            d="M11.1401 41.761V35.5537L16.7099 30.7196L20.0039 33.631L11.1401 41.761Z"
            fill="white"
          />
          <path
            d="M33.243 41.4138L18.9858 28.3575L32.4611 15.8879C36.2941 15.4924 36.2941 17.8471 35.815 19.074L25.7168 28.3575L37.567 39.1221L33.243 41.4138Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
};

export default Loader;
