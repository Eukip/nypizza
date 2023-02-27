import json
import firebase_admin
from firebase_admin import credentials, firestore
from NewYork.settings import env

cred = credentials.Certificate(env('PATH_TO_FIRESTORE'))
firebase_admin.initialize_app(cred)

db = firestore.client()


def send_data_to_firestore(order_id: int):
    from foods.serializers.admin.order import AdminOrderSerializer
    from foods.models import Order
    some_order = Order.objects.get(id=order_id)
    serialized_some_order = AdminOrderSerializer(some_order)
    print(serialized_some_order.data)
    json_some_order = json.dumps(serialized_some_order.data, ensure_ascii=False)
    dict_some_order = json.loads(json_some_order)
    doc_ref = db.collection(u'orders').document(f'{order_id}')
    doc_ref.set(dict_some_order)
    return True


def delete_data_from_firestore(order_id: int):
    print("starting delete collections")
    doc_ref = db.collection(u'orders').document(f'{order_id}')
    print("trying to delete")
    doc_ref.delete()
    print("successful delete")
    return True
