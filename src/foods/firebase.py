import requests
import json

# from django.conf import settings

token = 'dgfddjDeQlOfeksrmHroRy:APA91bFI5ctCd2ozkicUpDR3s9ju4oN1Ip7tyzSghKPyMXKiwxpuYR6r-hf_4SoLdUelkPaTxuR57gb5aXBqXOcjUs0kV6E-G6y5gBQZ9fYOKCjBD4YyTeqApg1IemDqvMqsB7DWKGbZ'
# local_key = 'AAAAa-f5pFo:APA91bEfDnJO9FtuoOfkOZsJdPKvQqsbqOxfcixB7VRaGbPxSOoVzux77yuIBFy2pPS7FO8HiFrDRntyiDS4Bb1Lqk0pgPIgeVSLlgDWIJvJUxLAE8KQiwam-gSOUOCF-wxk2tlhTZky'
prod_key = 'AAAAa-f5pFo:APA91bHiPJdE0G9TRE2d7sVu5zQeGhx8NLcMM7Wn2BokSnHyaFv7-c6su_rUXT-wURFMGKEc78uio5IboOROC3s8axGpBrryA4FNDifOLA2_7JhzvKromICLN6-k3eMzETKpufDrvR22'
second_token = 'cx_zkBV2SuKnt5zAfNHOa4:APA91bGW7TKuJg0HLrWOsBljlOkVYGR8gT3HM7OR2yuS6EmcMYZbGrQ02Sa1GPBEoryseukGHRlbV_PFIqo2hqCnCUd50IM8YubO-WLU4TW9nSN14HXkHeBEZtMML55XRub2gKg4alsx'
thrid_token = 'e3pPLTvkQvG7yEkU02Ilvn:APA91bFC8vHmWwvzyzyIs7yUNen4eo9f_-WmnvusnkdebXwFmGA65r9QS-N1sa3AVLBiVogz-QzdeeO0x_5dCCBgtz9Lsl19OGS34GsPzGmHJLPUVoHH0K7Gzqzp6GDJT-1DDYJ57zOS'
react_admin_key = 'AAAAa-f5pFo:APA91bEmvT7-Ve7Gpwymmy_ppIxKz4hh-_S1gyjpYVgVu1mNJwo8TpTjs7OrAvMiRlxkbZEH29gLIQzWpJDD0Gx-me4JvrjqHAywokDg7aMZaNnzQhxG6wpTdNMsTkf9zLOYiHzC2C19'


def fcm_notifications_order(private_key=prod_key, mobile_token=token, order_status='Status'):
    print('notification started')
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'key=' + private_key,
    }

    body = {
        'notification': {'title': 'Изменения статуса заказа',
                         'body': 'Статус вашего заказа был изменён на - {}'.format(order_status)
                         },
        'to': mobile_token,
        'priority': 'high',
    }
    try:
        response = requests.post("https://fcm.googleapis.com/fcm/send", headers=headers, data=json.dumps(body))
        print(response.status_code)
        print(response.json())
        return response.status_code
    except Exception as e:
        print(str(e))
        return False


# print(fcm_notifications(private_key=local_key))
# print(fcm_notifications(private_key=prod_key))
# print(firebase_admin.get_app())


def bulk_fcm_notifications(stocks_title: str, stocks_description: str):
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'key=' + 'AAAAa-f5pFo:APA91bHiPJdE0G9TRE2d7sVu5zQeGhx8NLcMM7Wn2BokSnHyaFv7-c6su_rUXT-wURFMGKEc78uio5IboOROC3s8axGpBrryA4FNDifOLA2_7JhzvKromICLN6-k3eMzETKpufDrvR22',
    }
    body = {
        "to": "APA91bH_1OI8OtJzyJTucwhvPp4ujZecTpQmRbiDccpbIeeQb9EAvxG9upSY9mz5ac7Yzo7z6gAvsZ_Xenq4B8heY8IYicCt49CkMrIE11zRjmA482GFJRLg5OG8jSC4QfXSZ8arWKrc",
        "notification": {
            "title": stocks_title,
            "body": stocks_description
        }
    }
    try:
        response = requests.post('https://fcm.googleapis.com/fcm/send',
                                 headers=headers, data=json.dumps(body))
        print(response.status_code)
        print(response.json())
        return True
    except Exception as e:
        print(str(e))
        return False


def add_to_fcm_topic(token_to: list = None):
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'key=' + 'AAAAa-f5pFo:APA91bHiPJdE0G9TRE2d7sVu5zQeGhx8NLcMM7Wn2BokSnHyaFv7-c6su_rUXT-wURFMGKEc78uio5IboOROC3s8axGpBrryA4FNDifOLA2_7JhzvKromICLN6-k3eMzETKpufDrvR22',
        'project_id': '463453398106'
    }
    body = {
        "operation": "add",
        "notification_key_name": "BulkNotifyNYPizza",
        "notification_key": "APA91bH_1OI8OtJzyJTucwhvPp4ujZecTpQmRbiDccpbIeeQb9EAvxG9upSY9mz5ac7Yzo7z6gAvsZ_Xenq4B8heY8IYicCt49CkMrIE11zRjmA482GFJRLg5OG8jSC4QfXSZ8arWKrc",
        "registration_ids": token_to
    }
    try:
        response = requests.post('https://fcm.googleapis.com/fcm/notification?notification_key_name=BulkNotifyNYPizza',
                                 headers=headers, data=json.dumps(body))
        print(response.status_code)
        print(response.json())
        return True
    except Exception as e:
        print(str(e))
        return False


def fcm_notifications_atc(operator_token, client_number, body_number, client_name,
                          private_key=react_admin_key, client_id=None, last_order_date=None,
                          last_order_id=None):
    print('notification started')
    print(private_key)
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'key=' + private_key,
    }

    body1 = {
        "to": operator_token,
        "notification": {
            "title": "Входящий звонок",
            "body": str(client_number),
        },
        "priority": "high",
    }
    body2 = {
        "to": operator_token,
        "notification": {
            "title": "Входящий звонок",
            "body": str(client_name)
        },
        "priority": "high",
        "data": {
                "client_number": str(client_number),
                "client_id": client_id,
                "last_order_date": str(last_order_date),
                "last_order_id": last_order_id
            }
        }
    selected_body = None
    if body_number == 1:
        selected_body = body1
    elif body_number == 2:
        selected_body = body2
    else:
        print(Exception)
        raise Exception
    try:
        print("try to send notify pbx")
        print(selected_body)
        response = requests.post("https://fcm.googleapis.com/fcm/send", headers=headers, data=json.dumps(selected_body))
        print(response.status_code)
        print(response.json())
        return response.status_code
    except Exception as e:
        print(str(e))
        return False
