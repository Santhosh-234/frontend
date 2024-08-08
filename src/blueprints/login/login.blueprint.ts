import { Abbreviations } from "../app/app.blueprint";

export class LoginBluePrint {
    public static _loginPageBluePrint :any = {
        pageCode: Abbreviations.login,
        sectionCode: "LGN_CARD",
        sectionName: "card",
        sectionType: "container",
        sectionClassName: "login-container",
        metaData: {},
        element: {
            LOGO: {
                sectionName: "logo",
                sectionType: "image",
                className: "product-logo",
                metaData: {},
                content: "src/assets/logo/logo-2.png",
            },
            WLCM_TXT: {
                sectionName: "welcome_text",
                sectionType: "text",
                className: "font-blue font-semibold",
                metaData: {},
                content: "LLM Integration Platform"
            },
            LGN_BTN :{
                sectionName: "login_button",
                sectionType: "button",
                className: "login-btn font mt-4",
                content: "Login",
                metaData: {},
                action: "",
            }
        }
    }
    public static getLoginBlueprintData = () =>{
        return this._loginPageBluePrint;
   }
}