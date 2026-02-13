import React, { createContext, useContext, useState, useCallback } from 'react';


export type Lang = 'en' | 'fr';
export type DeviceFormat = 'mobile' | 'tablet' | 'desktop';

interface AppContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  deviceFormat: DeviceFormat;
  setDeviceFormat: (f: DeviceFormat) => void;
}

const translations: Record<string, Record<Lang, string>> = {
  // Welcome page
  'welcome.heroTitle': { en: 'Patient Transport Tracking (V3)', fr: 'Suivi de transport des patients (V3)' },
  'welcome.heroSubtitle': { en: 'Stay informed about your loved one\'s critical care transport journey in real time.', fr: 'Restez informé du parcours de transport de soins intensifs de votre proche en temps réel.' },
  'welcome.modeTitle': { en: 'Select Transport Mode', fr: 'Sélectionner le mode de transport' },
  'welcome.modeSubtitle': { en: 'Choose the type of transport to track', fr: 'Choisissez le type de transport à suivre' },
  'welcome.air': { en: 'Air Transport', fr: 'Transport aérien' },
  'welcome.airDesc': { en: 'Helicopter & fixed-wing aircraft', fr: 'Hélicoptère et avion à voilure fixe' },
  'welcome.land': { en: 'Land Transport', fr: 'Transport terrestre' },
  'welcome.landDesc': { en: 'Ground ambulance services', fr: 'Services d\'ambulance terrestre' },
  'welcome.footer': { en: 'All information is confidential and secure.', fr: 'Toutes les informations sont confidentielles et sécurisées.' },

  // Format selector (platform)
  'format.welcome': { en: 'Patient Transport Tracking (V3)', fr: 'Suivi de transport des patients (V3)' },
  'format.description': { en: 'Automated real-time data from OCC and Flight Vector.', fr: 'Données en temps réel automatisées d\'OCC et Flight Vector.' },
  'format.title': { en: 'Choose Platform', fr: 'Choisir la plateforme' },
  'format.subtitle': { en: 'Choose a device view for the demo experience', fr: 'Choisissez une vue appareil pour la démo' },
  'format.mobile': { en: 'Mobile', fr: 'Mobile' },
  'format.mobile.desc': { en: 'Optimized for smartphones', fr: 'Optimisé pour smartphones' },
  'format.tablet': { en: 'Tablet', fr: 'Tablette' },
  'format.tablet.desc': { en: 'Enhanced layout for tablets', fr: 'Mise en page améliorée pour tablettes' },
  'format.desktop': { en: 'Desktop', fr: 'Bureau' },
  'format.desktop.desc': { en: 'Full dashboard experience', fr: 'Expérience tableau de bord complète' },

  // Login
  'login.title': { en: 'Patient Transport Tracking (V3)', fr: 'Suivi de transport des patients (V3)' },
  'login.subtitle': { en: 'Stay informed about your loved one\'s transport journey.', fr: 'Restez informé du parcours de transport de votre proche.' },
  'login.secure': { en: 'Secure & Private Access', fr: 'Accès sécurisé et privé' },
  'login.ref': { en: 'Transport Reference Number', fr: 'Numéro de référence du transport' },
  'login.nickname': { en: 'Nickname', fr: 'Surnom' },
  'login.nicknamePlaceholder': { en: 'e.g. Mom, Dad, Grandma', fr: 'ex. Maman, Papa, Grand-mère' },
  'login.lastName': { en: 'Patient Last Name', fr: 'Nom de famille du patient' },
  'login.track': { en: 'Track Transport', fr: 'Suivre le transport' },
  'login.verifying': { en: 'Verifying…', fr: 'Vérification…' },
  'login.sample': { en: 'View Sample Transport', fr: 'Voir un exemple de transport' },
  'login.error.empty': { en: 'Please enter both fields.', fr: 'Veuillez remplir les deux champs.' },
  'login.error.notFound': { en: 'Transport not found. Please check your details and try again.', fr: 'Transport introuvable. Vérifiez vos informations et réessayez.' },
  'login.privacy': { en: 'Information is limited for privacy. No medical records or diagnosis information is displayed.', fr: 'Les informations sont limitées pour la confidentialité. Aucun dossier médical ni diagnostic n\'est affiché.' },
  'login.backPlatform': { en: 'Select Platform', fr: 'Choisir la plateforme' },

  'dash.headerTitle': { en: 'Patient Transport Tracking', fr: 'Suivi du transport des patients' },
  'dash.liveTracking': { en: 'Live Tracking', fr: 'Suivi en direct' },
  'dash.flightProgress': { en: 'Flight Progress', fr: 'Progression du vol' },
  'dash.transportProgress': { en: 'Transport Progress', fr: 'Progression du transport' },
  'dash.updatesNote': { en: 'You will receive updates as the journey progresses.', fr: 'Vous recevrez des mises à jour au fur et à mesure du voyage.' },
  'dash.etaPickup': { en: 'ETA to Pickup', fr: 'Arrivée estimée au point de prise en charge' },
  'dash.etaDest': { en: 'ETA to Destination', fr: 'Arrivée estimée à destination' },
  'dash.etaDisclaimer': { en: 'Times are estimates and may change due to weather or operational factors.', fr: 'Les heures sont des estimations et peuvent changer en raison de la météo ou de facteurs opérationnels.' },
  'dash.from': { en: 'From:', fr: 'De :' },
  'dash.to': { en: 'To:', fr: 'Vers :' },
  'dash.transport': { en: "'s Transport", fr: ' — Transport' },
  'dash.origin': { en: 'Origin', fr: 'Origine' },
  'dash.destination': { en: 'Destination', fr: 'Destination' },
  'dash.alt': { en: 'Alt:', fr: 'Alt. :' },
  'dash.updates': { en: 'Updates', fr: 'Mises à jour' },
  'dash.privacy': { en: 'Information is limited for privacy. No medical records or diagnosis shown.', fr: 'Informations limitées pour la confidentialité. Aucun dossier médical ni diagnostic affiché.' },

  // Transport details
  'details.crew': { en: 'Crew Information', fr: 'Informations sur l\'équipage' },
  'details.crewType': { en: 'Crew Type', fr: 'Type d\'équipage' },
  'details.vehicleId': { en: 'Vehicle ID', fr: 'ID du véhicule' },
  'details.equipment': { en: 'Equipment Onboard', fr: 'Équipement à bord' },
  'details.clinical': { en: 'Clinical Summary', fr: 'Résumé clinique' },

  // Family support
  'support.title': { en: 'Support & Information', fr: 'Soutien et information' },
  'support.message': { en: 'We understand this is a stressful time. Our team is focused on providing safe and compassionate transport for your family member.', fr: 'Nous comprenons que c\'est un moment stressant. Notre équipe se concentre sur un transport sûr et compatissant pour votre proche.' },
  'support.coordination': { en: 'Transport Coordination', fr: 'Coordination du transport' },
  'support.whatHappens': { en: 'What happens during transport?', fr: 'Que se passe-t-il pendant le transport ?' },
  'support.whatHappensAnswer': { en: 'Your loved one is cared for by a specialized medical team throughout the journey.', fr: 'Votre proche est pris en charge par une équipe médicale spécialisée tout au long du trajet.' },

  // Admin
  'admin.title': { en: 'Demo Controls', fr: 'Contrôles de démonstration' },
  'admin.jumpTo': { en: 'Jump to a specific status:', fr: 'Aller à un statut spécifique :' },
  'admin.switchTo': { en: 'Switch to', fr: 'Passer en' },
  'admin.air': { en: 'Air', fr: 'Aérien' },
  'admin.land': { en: 'Land', fr: 'Terrestre' },
  'admin.simulateDelay': { en: 'Simulate Delay', fr: 'Simuler un retard' },
  'admin.undoDelay': { en: 'Undo Delay', fr: 'Annuler le retard' },

  // Share tracking
  'share.title': { en: 'Share Tracking', fr: 'Partager le suivi' },
  'share.description': { en: 'Share this link so others can follow the transport journey.', fr: 'Partagez ce lien pour que d\'autres puissent suivre le trajet.' },
  'share.button': { en: 'Share with others', fr: 'Partager avec d\'autres' },
  'share.text': { en: 'Follow this patient transport in real time.', fr: 'Suivez ce transport de patient en temps réel.' },

  // Milestones
  'milestone.0': { en: 'Preparing for Transport', fr: 'Préparation du transport' },
  'milestone.1': { en: 'Transport Team Assigned', fr: 'Équipe de transport assignée' },
  'milestone.2': { en: 'Team Dispatched', fr: 'Équipe envoyée' },
  'milestone.3': { en: 'En Route to Pickup Location', fr: 'En route vers le lieu de prise en charge' },
  'milestone.4': { en: 'Arrived at Pickup Location', fr: 'Arrivée au lieu de prise en charge' },
  'milestone.5': { en: 'Patient Transfer in Progress', fr: 'Transfert du patient en cours' },
  'milestone.6': { en: 'Departed from Pickup', fr: 'Départ du lieu de prise en charge' },
  'milestone.7': { en: 'En Route to Destination', fr: 'En route vers la destination' },
  'milestone.8': { en: 'Arrived at Destination', fr: 'Arrivée à destination' },
  'milestone.9': { en: 'Transport Completed', fr: 'Transport terminé' },

  'milestone.msg.0': { en: 'Our team is preparing for transport.', fr: 'Notre équipe prépare le transport.' },
  'milestone.msg.1': { en: 'A specialized crew has been assigned to this transport.', fr: 'Un équipage spécialisé a été assigné à ce transport.' },
  'milestone.msg.2': { en: 'The transport team has been dispatched.', fr: 'L\'équipe de transport a été envoyée.' },
  'milestone.msg.3': { en: 'The team is on the way to your family member.', fr: 'L\'équipe est en route vers votre proche.' },
  'milestone.msg.4': { en: 'Our team has arrived at the facility.', fr: 'Notre équipe est arrivée à l\'établissement.' },
  'milestone.msg.5': { en: 'Our crew is with your family member now, ensuring a safe transfer.', fr: 'Notre équipage est avec votre proche, assurant un transfert en toute sécurité.' },
  'milestone.msg.6': { en: 'Your family member is now in our care and the transport has begun.', fr: 'Votre proche est maintenant sous nos soins et le transport a commencé.' },
  'milestone.msg.7': { en: 'Transport to the destination facility is in progress. Our team is focused on safe and timely transport.', fr: 'Le transport vers l\'établissement de destination est en cours. Notre équipe se concentre sur un transport sûr et ponctuel.' },
  'milestone.msg.8': { en: 'Arrival at the destination facility has been confirmed.', fr: 'L\'arrivée à l\'établissement de destination a été confirmée.' },
  'milestone.msg.9': { en: 'The transport has been completed successfully. Your family member has been transferred to the care team.', fr: 'Le transport a été complété avec succès. Votre proche a été transféré à l\'équipe soignante.' },
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const [deviceFormat, setDeviceFormat] = useState<DeviceFormat>('mobile');

  const t = useCallback((key: string): string => {
    return translations[key]?.[lang] ?? key;
  }, [lang]);

  return (
    <AppContext.Provider value={{ lang, setLang, t, deviceFormat, setDeviceFormat }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
