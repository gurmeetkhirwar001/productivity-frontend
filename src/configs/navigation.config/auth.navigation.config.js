import { AUTH_PREFIX_PATH } from 'constants/route.constant'
import { NAV_ITEM_TYPE_TITLE, NAV_ITEM_TYPE_COLLAPSE, NAV_ITEM_TYPE_ITEM } from 'constants/navigation.constant'
import { ADMIN, USER } from 'constants/roles.constant'

const authNavigationConfig = [
  {
    key: "authentication",
    path: "",
    title: "AUTHENTICATION",
    translateKey: "nav.authentication.authentication",
    icon: "authentication",
    type: NAV_ITEM_TYPE_TITLE,
    authority: [ADMIN, USER],
    subMenu: [
      {
        key: "authentication.signIn",
        path: "",
        title: "Sign In",
        translateKey: "nav.authentication.signIn",
        icon: "signIn",
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [ADMIN, USER],
        subMenu: [
          {
            key: "authentication.signInCover",
            path: `${AUTH_PREFIX_PATH}/sign-in-cover`,
            title: "Cover",
            translateKey: "nav.authentication.signInCover",
            icon: "",
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN, USER],
            subMenu: [],
          },
        ],
      },
      {
        key: "authentication.signUp",
        path: "",
        title: "Sign Up",
        translateKey: "nav.authentication.signUp",
        icon: "signUp",
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [ADMIN, USER],
        subMenu: [
          {
            key: "authentication.signUpCover",
            path: `${AUTH_PREFIX_PATH}/sign-up-cover`,
            title: "Cover",
            translateKey: "nav.authentication.signUpCover",
            icon: "",
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN, USER],
            subMenu: [],
          },
        ],
      },
    ],
  },
];

export default authNavigationConfig