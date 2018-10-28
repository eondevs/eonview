import { Component } from '@angular/core';
import { NotificationsService } from '../../../services/notifications.service';

@Component({
  selector: 'notifications',
  templateUrl: 'src/angular/components/service/notifications/notifications.component.html',
  styleUrls: ['src/resources/styleSheets/css/main.css']
})
export class NotificationsComponent {
  constructor(private messagingService: NotificationsService) { }

  messages: any;

  ngOnInit() {
    this.messages = this.messagingService.getMessages();
  }
}