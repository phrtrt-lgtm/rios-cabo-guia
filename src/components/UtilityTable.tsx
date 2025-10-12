import { MapPin, Clock, Phone } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Utility {
  name: string;
  address: string;
  hours: string;
  phone: string;
  notes?: string;
}

interface UtilityTableProps {
  title: string;
  items: Utility[];
}

export const UtilityTable = ({ title, items }: UtilityTableProps) => {
  return (
    <div className="mb-8">
      <h4 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
        <span className="w-2 h-8 bg-secondary rounded"></span>
        {title}
      </h4>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Nome</TableHead>
              <TableHead className="font-semibold">Endereço</TableHead>
              <TableHead className="font-semibold">Horário</TableHead>
              <TableHead className="font-semibold">Contato</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => {
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address + ", Cabo Frio, RJ")}`;
              const whatsappUrl = item.phone.replace(/\D/g, '').length >= 10 
                ? `https://wa.me/55${item.phone.replace(/\D/g, '')}`
                : null;
              
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {item.name}
                    {item.notes && (
                      <span className="block text-xs text-secondary mt-1">{item.notes}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <a 
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1 text-sm"
                    >
                      <MapPin className="w-3 h-3" />
                      {item.address}
                    </a>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      {item.hours}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {whatsappUrl ? (
                      <a 
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        {item.phone}
                      </a>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {item.phone}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
