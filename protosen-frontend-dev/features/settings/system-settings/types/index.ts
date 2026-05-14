export type SystemSettings = {
  id: string;
  directorSignature: string | null;
  ministryName: string | null;
  protocolDirectionName: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SystemSettingsUpdate = {
  directorSignature?: string;
  ministryName?: string;
  protocolDirectionName?: string;
};

