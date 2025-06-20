// src/services/member.service.js

import GeocoderService from './geocoder.service.js';
import StorageService from '../utilities/storage.js';

class MemberService {
  constructor() {
    this.storageKey = 'members';
  }

  /**
   * Registra un nuevo miembro
   * @param {Object} memberData
   * @returns {Object} El nuevo miembro registrado
   */
  async registerMember(memberData) {
    // Validación básica
    if (!memberData.name || !memberData.address) {
      throw new Error('El nombre y la dirección son obligatorios');
    }

    // Determinar ubicación
    let location = {};

    if (memberData.latitude && memberData.longitude) {
      // Coordenadas proporcionadas (por ejemplo desde Leaflet)
      location = {
        lat: parseFloat(memberData.latitude),
        lon: parseFloat(memberData.longitude)
      };
    } else {
      // Geocodificar dirección si no hay coordenadas
      location = await GeocoderService.geocodeAddress(memberData.address);
    }

    const member = {
      id: Date.now().toString(),
      ...memberData,
      location,
      status: 'pending',
      registeredAt: new Date().toISOString(),
      verifiedAt: null,
      verifiedBy: null
    };

    // Guardar el miembro en almacenamiento
    const members = await this.getAllMembers();
    members.push(member);
    await StorageService.setItem(this.storageKey, members);

    return member;
  }

  /**
   * Devuelve todos los miembros almacenados
   * @returns {Array<Object>}
   */
  async getAllMembers() {
    return (await StorageService.getItem(this.storageKey)) || [];
  }

  /**
   * Verifica un miembro por ID
   * @param {string} memberId
   * @param {string} adminId
   * @returns {Object} Miembro actualizado
   */
  async verifyMember(memberId, adminId) {
    const members = await this.getAllMembers();
    const memberIndex = members.findIndex(m => m.id === memberId);

    if (memberIndex === -1) {
      throw new Error('Miembro no encontrado');
    }

    members[memberIndex] = {
      ...members[memberIndex],
      status: 'verified',
      verifiedAt: new Date().toISOString(),
      verifiedBy: adminId
    };

    await StorageService.setItem(this.storageKey, members);
    return members[memberIndex];
  }
}

export default new MemberService();
