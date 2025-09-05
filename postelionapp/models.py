from django.db import models


class User(models.Model):
    name = models.CharField(max_length=255)
    token = models.CharField(max_length=512, unique=True)
    last_logged = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name


class Credential(models.Model):
    module = models.CharField(max_length=255)
    submodule = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.module} - {self.submodule}"


class UserCredential(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    credential = models.ForeignKey(Credential, on_delete=models.CASCADE)


class CV(models.Model):
    # dane CV trzymasz w JSON lub osobnych polach
    content = models.JSONField()

    def __str__(self):
        return f"CV {self.id}"


class Meet(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField()
    city = models.CharField(max_length=255)
    street = models.CharField(max_length=255)
    remarks = models.TextField(null=True, blank=True)
    confirm_status = models.BooleanField(default=False)
    client_decline = models.BooleanField(default=False)

    def __str__(self):
        return f"Meet {self.city} - {self.date}"


class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
    send_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_messages")
    value = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message {self.id} from {self.sender}"


class MessageCustom(models.Model):
    message = models.ForeignKey(Message, on_delete=models.CASCADE)
    custom_name = models.CharField(max_length=50)
    custom_value = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.custom_name}: {self.custom_value}"


class Module(models.Model):
    name = models.CharField(max_length=255)
    value = models.CharField(max_length=255)
    icon = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.name


class Project(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.name