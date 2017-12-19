import { Component, OnInit } from '@angular/core';
import { Upload, UploadService } from '../../upload.service';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import 'rxjs/add/observable/of';

@Component({
  selector: 'app-upload-list',
  templateUrl: './upload-list.component.html',
  styleUrls: ['./upload-list.component.css']
})

export class UploadListComponent implements OnInit {
    uploadColletion: AngularFirestoreCollection<Upload>;
    uploadList: Observable<Upload[]>;
    uploads: Upload[];

    constructor(public up: UploadService, private db: AngularFirestore) {
        this.up.uploads.subscribe((uploads: Upload[]) => {
            this.uploads = uploads;
        });

        this.uploadColletion = this.db.collection('uploads', ref => ref.orderBy('name'));

        this.uploadList = this.uploadColletion.valueChanges();
    }

    ngOnInit() {
    }

}
