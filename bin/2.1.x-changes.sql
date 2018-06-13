alter table Invoice add FormNumber VARCHAR(200);
alter table FinancialAccount add ClassType VARCHAR(200);
alter table TimeTableSubject add academicYearStart VARCHAR(200), add academicYearEnd varchar(200);
alter table TimeTableCell add SchoolInfo_LocalId VARCHAR(200);

create table PersonalisedPlan (
RefId varchar(36) NOT NULL,
StudentPersonal_RefId varchar(36) DEFAULT NULL,
SchoolInfo_RefId varchar(36) DEFAULT NULL,
PersonalisedPlanCategory varchar(200) DEFAULT NULL,
PersonalisedPlanStartDate varchar(200) DEFAULT NULL,
PersonalisedPlanEndDate varchar(200) DEFAULT NULL,
PersonalisedPlanReviewDate varchar(200) DEFAULT NULL,
PersonalisedPlanNotes varchar(1000) DEFAULT NULL,
AssociatedAttachment varchar(200) DEFAULT NULL,
PRIMARY KEY (RefId)
);

create table PersonalisedPlan_Document (
PersonalisedPlan_RefId varchar(36) NOT NULL,
Id int(11) NOT NULL AUTO_INCREMENT,
Location varchar(200) DEFAULT NULL,
Sensitivity varchar(200) DEFAULT NULL,
URL varchar(200) DEFAULT NULL,
DocumentType varchar(200) DEFAULT NULL,
DocumentReviewDate varchar(200) DEFAULT NULL,
DocumentDescription varchar(200) DEFAULT NULL,
PRIMARY KEY (id),
KEY PersonalisedPlan_Document_IX (PersonalisedPlan_RefId)
);

create table WellbeingResponse (
RefId varchar(36) NOT NULL,
StudentPersonal_RefId varchar(36) DEFAULT NULL,
SchoolInfo_RefId varchar(36) DEFAULT NULL,
Date varchar(200) DEFAULT NULL,
WellbeingResponseStartDate varchar(200) DEFAULT NULL,
WellbeingResponseEndDate varchar(200) DEFAULT NULL,
WellbeingResponseCategory varchar(200) DEFAULT NULL,
WellbeingResponseNotes varchar(1000) DEFAULT NULL,
SuspensionContainer_SuspensionCategory varchar(200) DEFAULT NULL,
SuspensionContainer_Duration varchar(200) DEFAULT NULL,
SuspensionContainer_AdvisementDate varchar(200) DEFAULT NULL,
SuspensionContainer_ResolutionMeetingTime varchar(200) DEFAULT NULL,
SuspensionContainer_ResolutionNotes varchar(1000) DEFAULT NULL,
SuspensionContainer_EarlyReturnDate varchar(200) DEFAULT NULL,
SuspensionContainer_Status varchar(200) DEFAULT NULL,
DetentionContainer_DetentionCategory varchar(200) DEFAULT NULL,
DetentionContainer_DetentionDate varchar(200) DEFAULT NULL,
DetentionContainer_DetentionLocation varchar(200) DEFAULT NULL,
DetentionContainer_DetentionNotes varchar(1000) DEFAULT NULL,
DetentionContainer_Status varchar(200) DEFAULT NULL,
PlanRequiredContainer_Status varchar(200) DEFAULT NULL,
AwardContainer_AwardDate  varchar(200) DEFAULT NULL,
AwardContainer_AwardType  varchar(200) DEFAULT NULL,
AwardContainer_AwardDescription  varchar(200) DEFAULT NULL,
AwardContainer_AwardNotes  varchar(1000) DEFAULT NULL,
AwardContainer_Status varchar(200) DEFAULT NULL,
OtherWellbeingResponseContainer_OtherResponseDate  varchar(200) DEFAULT NULL,
OtherWellbeingResponseContainer_OtherResponseType  varchar(200) DEFAULT NULL,
OtherWellbeingResponseContainer_OtherResponseDescription  varchar(200) DEFAULT NULL,
OtherWellbeingResponseContainer_OtherResponseNotes  varchar(1000) DEFAULT NULL,
OtherWellbeingResponseContainer_Status  varchar(200) DEFAULT NULL,
PRIMARY KEY (RefId)
);

create table WellbeingResponse_SuspensionContainer_WithdrawalTime (
WellbeingResponse_RefId varchar(36) NOT NULL,
Id int(11) NOT NULL AUTO_INCREMENT,
WithdrawalDate  varchar(200) DEFAULT NULL,
WithdrawalStartTime  varchar(200) DEFAULT NULL,
WithdrawalEndTime  varchar(200) DEFAULT NULL,
TimeTableSubject_RefId  varchar(36) DEFAULT NULL,
ScheduledActivity_RefId  varchar(36) DEFAULT NULL,
TimeTableCell_RefId  varchar(36) DEFAULT NULL,
PRIMARY KEY (id),
KEY WellbeingResponse_Document_IX (WellbeingResponse_RefId)
);

create table WellbeingResponse_PlanRequiredContainer_PlanRequired (
WellbeingResponse_RefId varchar(36) NOT NULL,
Id int(11) NOT NULL AUTO_INCREMENT,
PersonalisedPlan_RefId  varchar(36) DEFAULT NULL,
PlanNotes  varchar(1000) DEFAULT NULL,
PRIMARY KEY (id),
KEY WellbeingResponse_Document_IX (WellbeingResponse_RefId)
);

create table WellbeingResponse_PersonInvolvement (
WellbeingResponse_RefId varchar(36) NOT NULL,
Id int(11) NOT NULL AUTO_INCREMENT,
PersonRefId varchar(36) DEFAULT NULL,
PersonRefId_SIF_RefObject varchar(200) DEFAULT NULL,
ShortName varchar(200) DEFAULT NULL,
HowInvolved varchar(200) DEFAULT NULL,
PRIMARY KEY (id),
KEY WellbeingResponse_Document_IX (WellbeingResponse_RefId)
);

create table WellbeingResponse_Document (
WellbeingResponse_RefId varchar(36) NOT NULL,
Id int(11) NOT NULL AUTO_INCREMENT,
Location varchar(200) DEFAULT NULL,
Sensitivity varchar(200) DEFAULT NULL,
URL varchar(200) DEFAULT NULL,
DocumentType varchar(200) DEFAULT NULL,
DocumentReviewDate varchar(200) DEFAULT NULL,
DocumentDescription varchar(200) DEFAULT NULL,
PRIMARY KEY (id),
KEY WellbeingResponse_Document_IX (WellbeingResponse_RefId)
);




create table WellbeingEvent (
RefId varchar(36) NOT NULL,
StudentPersonal_RefId varchar(36) DEFAULT NULL,
SchoolInfo_RefId varchar(36) DEFAULT NULL,
EventId  varchar(200) DEFAULT NULL,
WellbeingEventNotes  varchar(1000) DEFAULT NULL,
WellbeingEventCategoryClass  varchar(200) DEFAULT NULL,
ReportingStaffRefId  varchar(36) DEFAULT NULL,
WellbeingEventCreationTimeStamp  varchar(200) DEFAULT NULL,
WellbeingEventDate  varchar(200) DEFAULT NULL,
WellbeingEventTime  varchar(200) DEFAULT NULL,
WellbeingEventDescription  varchar(200) DEFAULT NULL,
WellbeingEventTimePeriod  varchar(200) DEFAULT NULL,
WellbeingEventLocationDetails_EventLocation varchar(200) DEFAULT NULL,
WellbeingEventLocationDetails_Class varchar(200) DEFAULT NULL,
WellbeingEventLocationDetails_FurtherLocationNotes varchar(1000) DEFAULT NULL,
ConfidentialFlag  varchar(200) DEFAULT NULL,
Status  varchar(200) DEFAULT NULL,
PRIMARY KEY (RefId)
);

create table WellbeingEvent_Document (
WellbeingEvent_RefId varchar(36) NOT NULL,
Id int(11) NOT NULL AUTO_INCREMENT,
Location varchar(200) DEFAULT NULL,
Sensitivity varchar(200) DEFAULT NULL,
URL varchar(200) DEFAULT NULL,
DocumentType varchar(200) DEFAULT NULL,
DocumentReviewDate varchar(200) DEFAULT NULL,
DocumentDescription varchar(200) DEFAULT NULL,
PRIMARY KEY (id),
KEY WellbeingEvent_Document_IX (WellbeingEvent_RefId)
);

create table WellbeingEvent_Category (
WellbeingEvent_RefId varchar(36) NOT NULL,
Id int(11) NOT NULL AUTO_INCREMENT,
EventCategory varchar(200) DEFAULT NULL,
PRIMARY KEY (id),
KEY WellbeingEvent_Category_IX (WellbeingEvent_RefId)
);

create table WellbeingEvent_Subcategory (
WellbeingEvent_RefId varchar(36) NOT NULL,
WellbeingEvent_CategoryId int(11) NOT NULL,
Id int(11) NOT NULL AUTO_INCREMENT,
EventCategory varchar(200) DEFAULT NULL,
PRIMARY KEY (id),
KEY WellbeingEvent_Subcategory_IX (WellbeingEvent_RefId),
KEY WellbeingEvent_Subcategory_Category_IX (WellbeingEvent_CategoryId),
CONSTRAINT WellbeingEvent_Subcategory_Category_FK FOREIGN KEY (WellbeingEvent_CategoryId) REFERENCES WellbeingEvent_Category (id)
);

create table WellbeingEvent_PersonInvolvement (
WellbeingEvent_RefId varchar(36) NOT NULL,
Id int(11) NOT NULL AUTO_INCREMENT,
PersonRefId varchar(36) DEFAULT NULL,
PersonRefId_SIF_RefObject varchar(200) DEFAULT NULL,
ShortName varchar(200) DEFAULT NULL,
HowInvolved varchar(200) DEFAULT NULL,
PRIMARY KEY (id),
KEY WellbeingEvent_PersonInvolvement_IX (WellbeingEvent_RefId)
);

create table WellbeingEvent_FollowupAction (
WellbeingEvent_RefId varchar(36) NOT NULL,
Id int(11) NOT NULL AUTO_INCREMENT,
WellbeingResponse_RefId varchar(36) DEFAULT NULL,
FollowUpDetails varchar(1000) DEFAULT NULL,
FollowUpActionCategory varchar(200) DEFAULT NULL,
PRIMARY KEY (id),
KEY WellbeingEvent_FollowupAction_IX (WellbeingEvent_RefId)
);

create table WellbeingCharacteristic (
RefId varchar(36) NOT NULL,
StudentPersonal_RefId varchar(36) DEFAULT NULL,
SchoolInfo_RefId varchar(36) DEFAULT NULL,
WellbeingCharacteristicClassification varchar(200) DEFAULT NULL,
WellbeingCharacteristicStartDate varchar(200) DEFAULT NULL,
WellbeingCharacteristicEndDate varchar(200) DEFAULT NULL,
WellbeingCharacteristicReviewDate varchar(200) DEFAULT NULL,
WellbeingCharacteristicNotes varchar(1000) DEFAULT NULL,
WellbeingCharacteristicCategory varchar(200) DEFAULT NULL,
WellbeingCharacteristicSubcategory varchar(200) DEFAULT NULL,
WellbeingCharacteristicLocalCharacteristicCode varchar(200) DEFAULT NULL,
WellbeingCharacteristicCharacteristicSeverity varchar(200) DEFAULT NULL,
WellbeingCharacteristicDailyManagement varchar(200) DEFAULT NULL,
WellbeingCharacteristicEmergencyManagement varchar(200) DEFAULT NULL,
WellbeingCharacteristicEmergencyResponsePlan varchar(200) DEFAULT NULL,
WellbeingCharacteristicTrigger varchar(200) DEFAULT NULL,
WellbeingCharacteristicConfidentialFlag varchar(200) DEFAULT NULL,
WellbeingCharacteristicAlert varchar(200) DEFAULT NULL,
PRIMARY KEY (RefId)
);

create table WellbeingCharacteristic_Document (
WellbeingCharacteristic_RefId varchar(36) NOT NULL,
Id int(11) NOT NULL AUTO_INCREMENT,
Location varchar(200) DEFAULT NULL,
Sensitivity varchar(200) DEFAULT NULL,
URL varchar(200) DEFAULT NULL,
DocumentType varchar(200) DEFAULT NULL,
DocumentReviewDate varchar(200) DEFAULT NULL,
DocumentDescription varchar(200) DEFAULT NULL,
PRIMARY KEY (id),
KEY WellbeingCharacteristic_Document_IX (WellbeingCharacteristic_RefId)
);

create table WellbeingCharacteristic_Medication (
WellbeingCharacteristic_RefId varchar(36) NOT NULL,
Id int(11) NOT NULL AUTO_INCREMENT,
MedicationName varchar(200) DEFAULT NULL,
Dosage varchar(200) DEFAULT NULL,
Frequency varchar(200) DEFAULT NULL,
AdministrationInformation varchar(200) DEFAULT NULL,
Method varchar(200) DEFAULT NULL,
PRIMARY KEY (id),
KEY WellbeingCharacteristic_Medication_IX (WellbeingCharacteristic_RefId)
);

create table WellbeingAppeal (
RefId varchar(36) NOT NULL,
StudentPersonal_RefId varchar(36) DEFAULT NULL,
SchoolInfo_RefId varchar(36) DEFAULT NULL,
WellbeingResponse_RefId varchar(36) DEFAULT NULL,
LocalAppealId  varchar(200) DEFAULT NULL,
AppealStatusCode  varchar(200) DEFAULT NULL,
Date  varchar(200) DEFAULT NULL,
AppealNotes  varchar(1000) DEFAULT NULL,
AppealOutcome  varchar(200) DEFAULT NULL,
PRIMARY KEY (RefId)
);

create table WellbeingAppeal_Document (
WellbeingAppeal_RefId varchar(36) NOT NULL,
Id int(11) NOT NULL AUTO_INCREMENT,
Location varchar(200) DEFAULT NULL,
Sensitivity varchar(200) DEFAULT NULL,
URL varchar(200) DEFAULT NULL,
DocumentType varchar(200) DEFAULT NULL,
DocumentReviewDate varchar(200) DEFAULT NULL,
DocumentDescription varchar(200) DEFAULT NULL,
PRIMARY KEY (id),
KEY WellbeingAppeal_Document_IX (WellbeingAppeal_RefId)
);

create table WellbeingAlert (
RefId varchar(36) NOT NULL,
StudentPersonal_RefId varchar(36) DEFAULT NULL,
SchoolInfo_RefId varchar(36) DEFAULT NULL,
Date  varchar(200) DEFAULT NULL,
WellbeingAlertStartDate varchar(200) DEFAULT NULL,
WellbeingAlertEndDate varchar(200) DEFAULT NULL,
WellbeingAlertCategory varchar(200) DEFAULT NULL,
WellbeingAlertDescription varchar(200) DEFAULT NULL,
EnrolmentRestricted varchar(200) DEFAULT NULL,
AlertAudience varchar(200) DEFAULT NULL,
AlertSeverity varchar(200) DEFAULT NULL,
AlertKeyContact varchar(200) DEFAULT NULL,
PRIMARY KEY (RefId)
);

create table StudentAttendanceTimeList_PeriodAttendance (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    studentAttendanceTimeList_RefId varchar(36) NOT NULL,
    attendanceType varchar(200) DEFAULT NULL,
    attendanceCode varchar(200) DEFAULT NULL,
    attendanceStatus varchar(200) DEFAULT NULL,
    date varchar(200) DEFAULT NULL,
    sessionInfo_RefId varchar(36) DEFAULT NULL,
    scheduledActivity_RefId varchar(36) DEFAULT NULL,
    timetablePeriod varchar(200) DEFAULT NULL,
    dayId varchar(200) DEFAULT NULL,
    startTime varchar(200) DEFAULT NULL,
    endTime varchar(200) DEFAULT NULL,
    timeIn varchar(200) DEFAULT NULL,
    timeOut varchar(200) DEFAULT NULL,
    timeTableCell_RefId varchar(36) DEFAULT NULL,
    timeTableSubject_RefId varchar(36) DEFAULT NULL,
    attendanceNote varchar(200) DEFAULT NULL);

ALTER TABLE StudentAttendanceTimeList_PeriodAttendance
ADD INDEX StudentAttendanceTimeList_PeriodAttendance_IX (studentAttendanceTimeList_RefId);

create table StudentAttendanceTimeList_PeriodAttendance_RoomInfo (
    PeriodAttendance_Id INT NOT NULL,
    RoomInfo_RefId varchar(36) NOT NULL,
    primary key (PeriodAttendance_Id, RoomInfo_RefId),
    index roominfo_periodattendance_ix (PeriodAttendance_Id),
    constraint roominfo_periodattendance_fk foreign key (PeriodAttendance_Id) references StudentAttendanceTimeList_PeriodAttendance (id));
    
create table StudentAttendanceTimeList_PeriodAttendance_TeacherCover (
   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   PeriodAttendance_Id INT NOT NULL,
	staffPersonal_RefId varchar(36) DEFAULT NULL,
    staffLocalId varchar(200) DEFAULT NULL,
    startTime varchar(200) DEFAULT NULL,
    finishTime varchar(200) DEFAULT NULL,
    credit varchar(200) DEFAULT NULL,
    supervision varchar(200) DEFAULT NULL,
    weighting varchar(200) DEFAULT NULL,
    index teachercover_periodattendance_ix (PeriodAttendance_Id),
    constraint teachercover_periodattendance_fk foreign key (PeriodAttendance_Id) references StudentAttendanceTimeList_PeriodAttendance (id));

create table StudentAttendanceTimeList_PeriodAttendance_OtherCode (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    PeriodAttendance_Id INT NOT NULL,
    OtherCode varchar(200) DEFAULT NULL,
    CodeSet varchar(200) DEFAULT NULL,
    index OtherCode_periodattendance_ix (PeriodAttendance_Id),
    constraint OtherCode_periodattendance_fk foreign key (PeriodAttendance_Id) references StudentAttendanceTimeList_PeriodAttendance (id));

ALTER TABLE StudentAttendanceTimeList_AttendanceTime
CHANGE COLUMN `Code` `AttendanceType` VARCHAR(200) NULL DEFAULT NULL ,
CHANGE COLUMN `AbsenceValue` `DurationValue` VARCHAR(200) NULL DEFAULT NULL ,
ADD COLUMN `TimeTableSubject_RefId` VARCHAR(36) NULL AFTER `AttendanceNote`;

ALTER TABLE StudentAttendanceTimeList_AttendanceTime
ADD CONSTRAINT AttendanceTime_TimeTableSubject_FK
  FOREIGN KEY (`TimeTableSubject_RefId`)
  REFERENCES TimeTableSubject (`RefId`);
