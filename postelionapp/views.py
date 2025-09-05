from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
from .models import Credential, User, CV, Meet, Message, MessageCustom, Module, Project
from .permissions import check_credentials

# ---------- CREDENTIALS ----------
@api_view(['GET'])
@check_credentials('credentials_read')
def credentials_list(request):
    creds = Credential.objects.values('id', 'module', 'submodule', 'description')
    return Response(list(creds), status=status.HTTP_200_OK)

@api_view(['GET'])
@check_credentials('credentials_read')
def credentials_detail(request, credentialId):
    creds = Credential.objects.filter(id=credentialId).values('id', 'module', 'submodule', 'description')
    return Response(list(creds), status=status.HTTP_200_OK)

@api_view(['POST'])
@check_credentials('credentials_write')
def credentials_create(request):
    Credential.objects.create(
        module=request.data.get('module'),
        submodule=request.data.get('submodule'),
        description=request.data.get('description')
    )
    return Response("Success", status=status.HTTP_200_OK)

@api_view(['POST'])
@check_credentials('credentials_write')
def credentials_remove(request, credentialId):
    deleted, _ = Credential.objects.filter(id=credentialId).delete()
    return Response({"deleted": deleted}, status=status.HTTP_200_OK)


# ---------- CV DEFAULT ----------
@api_view(['GET'])
@check_credentials('cv_read')
def cv_default(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT get_default_cv()")
        row = cursor.fetchone()
    default_cv = row[0] if row else "[]"

    user = User.objects.filter(token=request.headers['Authorization'].split(" ")[1]) \
        .values('id', 'name', 'last_logged').first()

    result = []
    result.extend(default_cv)
    result.append(user)

    return Response(result, status=status.HTTP_200_OK)


# ---------- MEETS ----------
@api_view(['GET'])
def meets_list(request):
    token = request.headers['Authorization'].split(" ")[1]
    result = Meet.objects.filter(user__token=token) \
        .values('date', 'city', 'street', 'remarks', 'confirm_status', 'client_decline')
    return Response(list(result), status=status.HTTP_200_OK)

@api_view(['GET'])
def meets_decline(request):
    token = request.headers['Authorization'].split(" ")[1]
    result = Meet.objects.filter(user__token=token) \
        .values('date', 'city', 'street', 'remarks', 'confirm_status', 'client_decline')
    return Response(list(result), status=status.HTTP_200_OK)


# ---------- MESSAGES ----------
@api_view(['GET'])
def messages_list(request):
    token = request.headers['Authorization'].split(" ")[1]
    msgs = Message.objects.raw("""
        SELECT m.id, s1.name as sender, s2.name as send_to, m.value, m.date,
               CASE WHEN s2.token = %s THEN TRUE ELSE FALSE END as received
        FROM messages m
        LEFT JOIN users s1 ON s1.id = m.sender_id
        LEFT JOIN users s2 ON s2.id = m.send_to
        WHERE s1.token = %s OR s2.token = %s
        ORDER BY m.date
    """, [token, token, token])

    result = [dict(m.__dict__) for m in msgs]

    add_meet = MessageCustom.objects.filter(custom_name='meet', message__sender__token=token) \
        .select_related('message').values()

    for r in result:
        for meet in add_meet:
            if meet['message_id'] == r['id']:
                r['meet_info'] = meet

    return Response(result, status=status.HTTP_200_OK)


@api_view(['POST'])
def messages_send(request):
    if not request.data.get("value"):
        return Response("message is empty", status=status.HTTP_400_BAD_REQUEST)

    token = request.headers['Authorization'].split(" ")[1]
    sender = User.objects.filter(token=token).first()
    if not sender:
        return Response("User not found", status=status.HTTP_404_NOT_FOUND)

    Message.objects.create(sender=sender, value=request.data['value'], send_to_id=2)
    return Response("success", status=status.HTTP_200_OK)


@api_view(['POST'])
def messages_send_meet(request):
    token = request.headers['Authorization'].split(" ")[1]
    sender = User.objects.filter(token=token).first()

    msg = Message.objects.create(sender=sender, value="message_custom_meet", send_to_id=2)
    meet = Meet.objects.create(
        user=sender,
        date=request.data.get('date'),
        city=request.data.get('city'),
        street=request.data.get('street'),
        remarks=request.data.get('remarks')
    )
    MessageCustom.objects.create(message=msg, custom_name="meet", custom_value=meet.id)
    return Response("success", status=status.HTTP_200_OK)


# ---------- MODULES ----------
@api_view(['GET'])
@check_credentials('modules_read')
def modules_list(request):
    mods = Module.objects.values('id', 'name', 'value', 'icon')
    return Response(list(mods), status=status.HTTP_200_OK)

@api_view(['GET'])
def modules_current(request):
    token = request.headers['Authorization'].split(" ")[1]
    mods = Module.objects.raw("""
        SELECT modules.id, modules.name, modules.value, modules.icon
        FROM user_credentials
        LEFT JOIN credentials ON credentials.id = user_credentials.credentialID
        LEFT JOIN users ON users.id = user_credentials.userId
        LEFT JOIN modules ON modules.id = CAST(credentials.submodule AS INTEGER)
        WHERE credentials.module = 'module' AND users.token = %s
    """, [token])
    return Response([dict(m.__dict__) for m in mods], status=status.HTTP_200_OK)


# ---------- PROJECTS ----------
@api_view(['GET'])
@check_credentials('projects_read')
def projects_list(request):
    projects = Project.objects.all().order_by('order').values()
    return Response(list(projects), status=status.HTTP_200_OK)