/**
 * Crosswalk and ODP tools — Rev2→Rev3 mapping, DoD ODPs, 800-53 mapping
 */

export function registerCrosswalkTools(server, data) {

  server.tool(
    'get_crosswalk',
    'Get the Rev 2 to Rev 3 mapping for a specific control. Shows what changed, new ODPs, and related 800-53 controls.',
    {
      rev2Id: { type: 'string', description: 'Rev 2 control ID (e.g. "3.1.1")' }
    },
    async ({ rev2Id }) => {
      const mapping = data.crosswalk.mapping.find(m => m.rev2 === rev2Id);
      if (!mapping) {
        return { content: [{ type: 'text', text: `No crosswalk mapping found for Rev 2 control ${rev2Id}` }] };
      }

      const odps = data.crosswalk.odps[mapping.rev3];
      const migrationInfo = data.migration.migration[rev2Id];

      const result = {
        rev2: mapping.rev2,
        rev3: mapping.rev3,
        status: mapping.status,
        changeDescription: mapping.change,
        ...(mapping.newOdps ? { newODPAreas: mapping.newOdps } : {}),
        ...(odps ? {
          dodODPs: {
            title: odps.title,
            relatedControls: odps.relatedControls,
            parameters: odps.odps
          }
        } : {}),
        ...(migrationInfo ? {
          migrationDetail: {
            changeType: migrationInfo.changeType,
            notes: migrationInfo.notes
          }
        } : {})
      };

      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    'get_odp_values',
    'Get DoD-defined Organization-Defined Parameter (ODP) values for a Rev 3 control. These are the official parameter values organizations must use.',
    {
      controlId: { type: 'string', description: 'Rev 3 control ID (e.g. "03.01.01", "03.05.03")' }
    },
    async ({ controlId }) => {
      const odps = data.crosswalk.odps[controlId];
      if (!odps) {
        // Check migration ODPs as fallback
        const migOdps = data.migration.odps[controlId];
        if (migOdps) {
          return { content: [{ type: 'text', text: JSON.stringify({ controlId, source: 'migration', ...migOdps }, null, 2) }] };
        }
        return { content: [{ type: 'text', text: `No ODP values found for ${controlId}. Not all Rev 3 controls have DoD-defined ODPs.` }] };
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            controlId,
            title: odps.title,
            relatedControls: odps.relatedControls,
            parameterCount: odps.odps.length,
            parameters: odps.odps.map(p => ({
              id: p.id,
              parameter: p.param,
              dodValue: p.value
            }))
          }, null, 2)
        }]
      };
    }
  );

  server.tool(
    'get_new_rev3_controls',
    'List all new controls added in NIST 800-171 Rev 3 that have no Rev 2 equivalent.',
    {},
    async () => {
      const controls = data.crosswalk.newControls;
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            count: controls.length,
            description: 'These controls are new in Rev 3 and must be implemented by organizations transitioning from Rev 2.',
            controls: controls.map(c => ({
              id: c.id,
              family: c.family,
              familyName: data.crosswalk.famFull[c.family] || c.family,
              title: c.title,
              description: c.description
            }))
          }, null, 2)
        }]
      };
    }
  );

  server.tool(
    'get_800_53_mapping',
    'Get the NIST 800-53 Rev 5 to 800-171 Rev 3 tailoring mapping for a specific 800-53 control.',
    {
      controlId: { type: 'string', description: '800-53 control ID (e.g. "AC-02", "IA-05", "SC-08")' }
    },
    async ({ controlId }) => {
      const mapping = data.mapping80053[controlId];
      if (!mapping) {
        return { content: [{ type: 'text', text: `No 800-53 to 171 mapping found for ${controlId}` }] };
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            '800-53': controlId,
            title: mapping.title,
            '171Rev3': mapping['171Rev3'],
            '171Title': mapping['171Title'],
            tailoring: mapping.tailoring,
            ...(mapping.notes ? { notes: mapping.notes } : {}),
            ...(mapping.subControls ? {
              subControls: Object.entries(mapping.subControls).map(([id, sub]) => ({
                id,
                title: sub.title,
                '171Rev3': sub['171Rev3'],
                tailoring: sub.tailoring
              }))
            } : {})
          }, null, 2)
        }]
      };
    }
  );
}
