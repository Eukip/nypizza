from accounts.views.mobile_app.token import (
    TokenObtainPairWithoutPasswordView,
    VerifyAccessTokenView,
)
from accounts.views.mobile_app.user import (
    APIRetrieveProfileView,
    APIUpdateProfileView,
)
from accounts.views.mobile_app.adress import (
    APIAddressListCreateView,
    APIDestroyUserAddressView,
    APIUserAddressQuantityView
)
from accounts.views.mobile_app.verify_number import (
    VerifyPhoneNumberAPIView,
    SendSmsToPhoneNumberAPIView,
)