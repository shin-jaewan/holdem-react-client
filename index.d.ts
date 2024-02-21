declare module "*.jpg";
declare module "*.jpeg";
declare module "*.png";
declare module "*.svg";
declare module "*.mp4";

declare module global {
    interface Window {
        kakao: any;
    }
    const kakao: any;
}
