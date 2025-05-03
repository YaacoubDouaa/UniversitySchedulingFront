// import {
//   SalleDTO,
//   SeanceDTO,
//   BrancheDTO,
//   TDDTO,
//   TPDTO,
//   PersonneDTO,
//   AdministrateurDTO,
//   EnseignantDTO,
//   TechnicienDTO,
//   EtudiantDTO,
//   SeanceConflictDTO
// } from './dto';
// import { DTOMapper } from './dto-mapper';
// import { Salle, SalleList } from './Salle';
// import { Seance, SeanceConflict } from './Seance';
// import { Branche, TD, TP, BrancheList, TDList } from './Branches';
// import { Personne, Administrateur, Enseignant, Technicien, Etudiant } from './Users';
//
// /**
//  * SalleMapper - Converts between SalleDTO and Salle domain models
//  */
// export class SalleMapper {
//   static fromDTO(dto: SalleDTO): Salle {
//     return DTOMapper.fromDTO(dto, Salle, {
//       propertyMap: {
//         'id': 'id',
//         'identifiant': 'name',
//         'type': 'type',
//         'capacite': 'capacite'
//       },
//       customMapping: (dto: SalleDTO, salle: Salle) => {
//         // Initialize empty schedule
//         salle.schedule = {};
//
//         // Parse capacite if it comes as a string
//         salle.capacite = typeof dto.capacite === 'number' ? dto.capacite : parseInt(dto.capacite.toString(), 10);
//       }
//     });
//   }
//
//   static toDTO(salle: Salle): SalleDTO {
//     return DTOMapper.toDTO(salle, SalleDTO, {
//       propertyMap: {
//         'id': 'id',
//         'name': 'identifiant',
//         'type': 'type',
//         'capacite': 'capacite'
//       },
//       customMapping: (salle: Salle, dto: SalleDTO) => {
//         // Extract session IDs from schedule if available
//         dto.seanceIds = [];
//         if (salle.schedule) {
//           const seanceIds = new Set<number>();
//           Object.keys(salle.schedule).forEach(day => {
//             Object.keys(salle.schedule[day] || {}).forEach(niveau => {
//               Object.keys(salle.schedule[day][niveau] || {}).forEach(time => {
//                 salle.schedule[day][niveau][time].forEach(seance => {
//                   if (seance && seance.id) {
//                     seanceIds.add(seance.id);
//                   }
//                 });
//               });
//             });
//           });
//           dto.seanceIds = Array.from(seanceIds);
//         }
//
//         // Set availability based on schedule
//         dto.disponibilite = [];
//       }
//     });
//   }
//
//   static fromDTOArray(dtos: SalleDTO[]): Salle[] {
//     return dtos?.map(dto => this.fromDTO(dto)) || [];
//   }
//
//   static toDTOArray(salles: Salle[]): SalleDTO[] {
//     return salles?.map(salle => this.toDTO(salle)) || [];
//   }
//
//   static toSalleList(salles: Salle[]): SalleList {
//     const salleList: SalleList = {};
//     salles.forEach(salle => {
//       salleList[salle.id.toString()] = salle;
//     });
//     return salleList;
//   }
// }
//
// /**
//  * SeanceMapper - Converts between SeanceDTO and Seance domain models
//  */
// export class SeanceMapper {
//   static fromDTO(dto: SeanceDTO): Seance {
//     const seance: Seance = {
//       id: dto.id ? parseInt(dto.id, 10) : 0,
//       name: dto.matiere || '',
//       room: dto.salle?.name || '',
//       type: dto.type || '',
//       professor: dto.enseignant?.name || '',
//       groupe: (dto.branches && dto.branches.length > 0) ? dto.branches[0].name : '',
//       biWeekly: dto.frequence === 'biweekly',
//       day: dto.jour || '',
//       time: dto.heureDebut || ''
//     };
//
//     // Set rattrapage flag based on frequence
//     seance.isRattrapage = dto.frequence === 'rattrapage';
//
//     // Parse additional properties if available
//     if (seance.isRattrapage && dto.frequence && dto.frequence.includes('date:')) {
//       const dateMatch = dto.frequence.match(/date:(\d{4}-\d{2}-\d{2})/);
//       if (dateMatch && dateMatch[1]) {
//         seance.rattrapageDate = new Date(dateMatch[1]);
//       }
//     }
//
//     return seance;
//   }
//
//   static toDTO(seance: Seance): SeanceDTO {
//     const dto: SeanceDTO = {
//       id: seance.id?.toString(),
//       jour: seance.day || '',
//       heureDebut: seance.time || '',
//       heureFin: calculateEndTime(seance.time || ''),
//       type: seance.type || '',
//       matiere: seance.name || '',
//       frequence: seance.biWeekly ? 'biweekly' : (seance.isRattrapage ? 'rattrapage' : 'weekly')
//     };
//
//     // Add room information
//     if (seance.room) {
//       dto.salle = { name: seance.room };
//     }
//
//     // Add professor information
//     if (seance.professor) {
//       dto.enseignant = { name: seance.professor };
//     }
//
//     // Add branch information
//     if (seance.groupe) {
//       dto.branches = [{ name: seance.groupe }];
//     }
//
//     // Handle rattrapage date if available
//     if (seance.isRattrapage && seance.rattrapageDate) {
//       const dateString = seance.rattrapageDate instanceof Date
//         ? seance.rattrapageDate.toISOString().split('T')[0]
//         : seance.rattrapageDate;
//       dto.frequence = `rattrapage:date:${dateString}`;
//     }
//
//     return dto;
//   }
//
//   static fromDTOArray(dtos: SeanceDTO[]): Seance[] {
//     return dtos?.map(dto => this.fromDTO(dto)) || [];
//   }
//
//   static toDTOArray(seances: Seance[]): SeanceDTO[] {
//     return seances?.map(seance => this.toDTO(seance)) || [];
//   }
//
//   static toConflict(dto: SeanceConflictDTO, seance1: Seance, seance2: Seance, day: string, time: string): SeanceConflict {
//     return {
//       seance1,
//       seance2,
//       day,
//       time,
//       conflictTypes: dto.conflictTypes || ['Unknown Conflict']
//     };
//   }
// }
//
// /**
//  * BrancheMapper - Converts between BrancheDTO and Branche domain models
//  */
// export class BrancheMapper {
//   static fromDTO(dto: BrancheDTO, seances?: Seance[]): Branche {
//     return DTOMapper.fromDTO(dto, Branche, {
//       propertyMap: {
//         'id': 'id',
//         'niveau': 'niveau',
//         'specialite': 'specialite',
//         'nbTD': 'nbTD',
//         'departement': 'departement'
//       },
//       customMapping: (dto: BrancheDTO, branche: Branche) => {
//         // Map seances if provided
//         if (seances && dto.seanceIds) {
//           branche.seances = seances.filter(seance =>
//             dto.seanceIds.includes(seance.id)
//           );
//         } else {
//           branche.seances = [];
//         }
//       }
//     });
//   }
//
//   static toDTO(branche: Branche): BrancheDTO {
//     return DTOMapper.toDTO(branche, BrancheDTO, {
//       propertyMap: {
//         'id': 'id',
//         'niveau': 'niveau',
//         'specialite': 'specialite',
//         'nbTD': 'nbTD',
//         'departement': 'departement'
//       },
//       customMapping: (branche: Branche, dto: BrancheDTO) => {
//         // Extract seance IDs
//         dto.seanceIds = branche.seances?.map(seance => seance.id) || [];
//       }
//     });
//   }
//
//   static fromDTOArray(dtos: BrancheDTO[], seances?: Seance[]): Branche[] {
//     return dtos?.map(dto => this.fromDTO(dto, seances)) || [];
//   }
//
//   static toDTOArray(branches: Branche[]): BrancheDTO[] {
//     return branches?.map(branche => this.toDTO(branche)) || [];
//   }
// }
//
// /**
//  * TDMapper - Converts between TDDTO and TD domain models
//  */
// export class TDMapper {
//   static fromDTO(dto: TDDTO, branches?: Branche[], tps?: TP[]): TD {
//     const td = new TD();
//     td.id = dto.id;
//     td.nb = dto.nb;
//     td.nbTP = dto.nbTP;
//
//     // Find and assign the matching branche
//     if (branches && branches.length) {
//       const matchingBranche = branches.find(b => b.id === dto.brancheId);
//       if (matchingBranche) {
//         td.branche = matchingBranche;
//       } else {
//         // Create a placeholder branche if not found
//         td.branche = {
//           id: dto.brancheId,
//           niveau: '',
//           specialite: '',
//           nbTD: 0,
//           departement: '',
//           seances: []
//         };
//       }
//     } else {
//       // Create a placeholder branche if branches not provided
//       td.branche = {
//         id: dto.brancheId,
//         niveau: '',
//         specialite: '',
//         nbTD: 0,
//         departement: '',
//         seances: []
//       };
//     }
//
//     // Assign TP list if available
//     if (tps && dto.tpIds) {
//       td.tpList = tps.filter(tp => dto.tpIds.includes(tp.id));
//     } else {
//       td.tpList = [];
//     }
//
//     return td;
//   }
//
//   static toDTO(td: TD): TDDTO {
//     const dto = new TDDTO();
//     dto.id = td.id;
//     dto.nb = td.nb;
//     dto.nbTP = td.nbTP;
//     dto.brancheId = td.branche?.id || 0;
//
//     // Extract TP IDs
//     dto.tpIds = td.tpList?.map(tp => tp.id) || [];
//
//     // Extract seance IDs from all TPs if available
//     const seanceIds = new Set<number>();
//     td.tpList?.forEach(tp => {
//       // This would need to be populated based on your actual model structure
//     });
//     dto.seanceIds = Array.from(seanceIds);
//
//     return dto;
//   }
//
//   static fromDTOArray(dtos: TDDTO[], branches?: Branche[], tps?: TP[]): TD[] {
//     return dtos?.map(dto => this.fromDTO(dto, branches, tps)) || [];
//   }
//
//   static toDTOArray(tds: TD[]): TDDTO[] {
//     return tds?.map(td => this.toDTO(td)) || [];
//   }
//
//   static toTDList(tds: TD[]): TDList[] {
//     return tds?.map(td => ({
//       name: `${td.branche?.niveau || ''} ${td.branche?.specialite || ''} TD${td.nb}`,
//       tpList: td.tpList || []
//     })) || [];
//   }
// }
//
// /**
//  * TPMapper - Converts between TPDTO and TP domain models
//  */
// export class TPMapper {
//   static fromDTO(dto: TPDTO, tds?: TD[], etudiants?: Etudiant[]): TP {
//     const tp = new TP();
//     tp.id = dto.id;
//     tp.nb = dto.nb;
//
//     // Find and assign the matching TD
//     if (tds && tds.length) {
//       const matchingTD = tds.find(t => t.id === dto.tdId);
//       if (matchingTD) {
//         tp.td = matchingTD;
//       } else {
//         // Create a placeholder TD if not found
//         tp.td = {
//           id: dto.tdId,
//           nb: 0,
//           nbTP: 0,
//           branche: {} as Branche,
//           tpList: []
//         };
//       }
//     } else {
//       // Create a placeholder TD if TDs not provided
//       tp.td = {
//         id: dto.tdId,
//         nb: 0,
//         nbTP: 0,
//         branche: {} as Branche,
//         tpList: []
//       };
//     }
//
//     // Assign student list if available
//     if (etudiants && dto.etudiantIds) {
//       tp.etudiants = etudiants.filter(etudiant =>
//         dto.etudiantIds.includes(etudiant.id || 0)
//       );
//     } else {
//       tp.etudiants = [];
//     }
//
//     return tp;
//   }
//
//   static toDTO(tp: TP): TPDTO {
//     const dto = new TPDTO();
//     dto.id = tp.id;
//     dto.nb = tp.nb;
//     dto.tdId = tp.td?.id || 0;
//
//     // Extract student IDs
//     dto.etudiantIds = tp.etudiants?.map(etudiant => etudiant.id || 0) || [];
//
//     // This would need to be populated from the actual sessions assigned to this TP
//     dto.seanceIds = [];
//
//     return dto;
//   }
//
//   static fromDTOArray(dtos: TPDTO[], tds?: TD[], etudiants?: Etudiant[]): TP[] {
//     return dtos?.map(dto => this.fromDTO(dto, tds, etudiants)) || [];
//   }
//
//   static toDTOArray(tps: TP[]): TPDTO[] {
//     return tps?.map(tp => this.toDTO(tp)) || [];
//   }
// }
//
// /**
//  * PersonneMapper - Base mapper for all person types
//  */
// export class PersonneMapper {
//   static fromDTO(dto: PersonneDTO): Personne {
//     return DTOMapper.fromDTO(dto, Personne, {
//       propertyMap: {
//         'id': 'id',
//         'cin': 'cin',
//         'nom': 'nom',
//         'prenom': 'prenom',
//         'email': 'email',
//         'tel': 'tel',
//         'adresse': 'adresse'
//       }
//     });
//   }
//
//
//
//
//
//
//   static fromDTOArray(dtos: AdministrateurDTO[]): Administrateur[] {
//     return dtos?.map(dto => this.fromDTO(dto)) || [];
//   }
//
//   static toDTOArray(admins: Administrateur[]): AdministrateurDTO[] {
//     return admins?.map(admin => this.toDTO(admin)) || [];
//   }
// }
//
// /**
//  * EnseignantMapper - Converts between EnseignantDTO and Enseignant domain models
//  */
// export class EnseignantMapper {
//   static fromDTO(dto: EnseignantDTO): Enseignant {
//     return DTOMapper.fromDTO(dto, Enseignant, {
//       propertyMap: {
//         'id': 'id',
//         'cin': 'cin',
//         'nom': 'nom',
//         'prenom': 'prenom',
//         'email': 'email',
//         'tel': 'tel',
//         'adresse': 'adresse',
//         'codeEnseignant': 'codeEnseignant',
//         'heures': 'heures'
//       },
//       customMapping: (dto: EnseignantDTO, enseignant: Enseignant) => {
//         // Store seance IDs for later reference
//         enseignant.seanceIds = dto.seanceIds || [];
//         enseignant.propositionIds = dto.propositionIds || [];
//         enseignant.signalIds = dto.signalIds || [];
//       }
//     });
//   }
//
//   static toDTO(enseignant: Enseignant): EnseignantDTO {
//     return DTOMapper.toDTO(enseignant, EnseignantDTO, {
//       propertyMap: {
//         'id': 'id',
//         'cin': 'cin',
//         'nom': 'nom',
//         'prenom': 'prenom',
//         'email': 'email',
//         'tel': 'tel',
//         'adresse': 'adresse',
//         'codeEnseignant': 'codeEnseignant',
//         'heures': 'heures'
//       },
//       customMapping: (enseignant: Enseignant, dto: EnseignantDTO) => {
//         // Map stored IDs back to DTO
//         dto.seanceIds = enseignant.seanceIds || [];
//         dto.propositionIds = enseignant.propositionIds || [];
//         dto.signalIds = enseignant.signalIds || [];
//       }
//     });
//   }
//
//   static fromDTOArray(dtos: EnseignantDTO[]): Enseignant[] {
//     return dtos?.map(dto => this.fromDTO(dto)) || [];
//   }
//
//   static toDTOArray(enseignants: Enseignant[]): EnseignantDTO[] {
//     return enseignants?.map(enseignant => this.toDTO(enseignant)) || [];
//   }
// }
//
// /**
//  * TechnicienMapper - Converts between TechnicienDTO and Technicien domain models
//  */
// export class TechnicienMapper {
//   static fromDTO(dto: TechnicienDTO): Technicien {
//     return DTOMapper.fromDTO(dto, Technicien, {
//       propertyMap: {
//         'id': 'id',
//         'cin': 'cin',
//         'nom': 'nom',
//         'prenom': 'prenom',
//         'email': 'email',
//         'tel': 'tel',
//         'adresse': 'adresse',
//         'codeTechnicien': 'codeTechnicien'
//       }
//     });
//   }
//
//   static toDTO(technicien: Technicien): TechnicienDTO {
//     return DTOMapper.toDTO(technicien, TechnicienDTO, {
//       propertyMap: {
//         'id': 'id',
//         'cin': 'cin',
//         'nom': 'nom',
//         'prenom': 'prenom',
//         'email': 'email',
//         'tel': 'tel',
//         'adresse': 'adresse',
//         'codeTechnicien': 'codeTechnicien'
//       }
//     });
//   }
//
//   static fromDTOArray(dtos: TechnicienDTO[]): Technicien[] {
//     return dtos?.map(dto => this.fromDTO(dto)) || [];
//   }
//
//   static toDTOArray(techniciens: Technicien[]): TechnicienDTO[] {
//     return techniciens?.map(technicien => this.toDTO(technicien)) || [];
//   }
// }
//
// /**
//  * EtudiantMapper - Converts between EtudiantDTO and Etudiant domain models
//  */
// export class EtudiantMapper {
//   static fromDTO(dto: EtudiantDTO, branches?: Branche[], tps?: TP[]): Etudiant {
//     return DTOMapper.fromDTO(dto, Etudiant, {
//       propertyMap: {
//         'id': 'id',
//         'cin': 'cin',
//         'nom': 'nom',
//         'prenom': 'prenom',
//         'email': 'email',
//         'tel': 'tel',
//         'adresse': 'adresse',
//         'matricule': 'matricule'
//       },
//       customMapping: (dto: EtudiantDTO, etudiant: Etudiant) => {
//         // Store branche and TP IDs
//         etudiant.brancheId = dto.brancheId;
//         etudiant.tpId = dto.tpId;
//
//         // Find and assign matching branche
//         if (branches) {
//           etudiant.branche = branches.find(b => b.id === dto.brancheId);
//         }
//
//         // Find and assign matching TP
//         if (tps) {
//           etudiant.tp = tps.find(tp => tp.id === dto.tpId);
//         }
//       }
//     });
//   }
//
//   static toDTO(etudiant: Etudiant): EtudiantDTO {
//     return DTOMapper.toDTO(etudiant, EtudiantDTO, {
//       propertyMap: {
//         'id': 'id',
//         'cin': 'cin',
//         'nom': 'nom',
//         'prenom': 'prenom',
//         'email': 'email',
//         'tel': 'tel',
//         'adresse': 'adresse',
//         'matricule': 'matricule'
//       },
//       customMapping: (etudiant: Etudiant, dto: EtudiantDTO) => {
//         // Map branche and TP IDs
//         dto.brancheId = etudiant.brancheId || etudiant.branche?.id || 0;
//         dto.tpId = etudiant.tpId || etudiant.tp?.id || 0;
//       }
//     });
//   }
//
//   static fromDTOArray(dtos: EtudiantDTO[], branches?: Branche[], tps?: TP[]): Etudiant[] {
//     return dtos?.map(dto => this.fromDTO(dto, branches, tps)) || [];
//   }
//
//   static toDTOArray(etudiants: Etudiant[]): EtudiantDTO[] {
//     return etudiants?.map(etudiant => this.toDTO(etudiant)) || [];
//   }
// }
//
// /**
//  * Helper function to calculate end time based on start time
//  * Assumes a standard session duration (e.g., 1.5 hours)
//  */
// function calculateEndTime(startTime: string): string {
//   if (!startTime) return '';
//
//   const [hours, minutes] = startTime.split(':').map(Number);
//   let endHours = hours;
//   let endMinutes = minutes + 90; // Default 1.5 hour sessions
//
//   if (endMinutes >= 60) {
//     endHours += Math.floor(endMinutes / 60);
//     endMinutes = endMinutes % 60;
//   }
//
//   if (endHours >= 24) {
//     endHours = endHours % 24;
//   }
//
//   return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
// }
