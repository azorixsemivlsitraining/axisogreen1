import * as React from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Admin() {
  const [quotes, setQuotes] = React.useState<any[]>([]);
  const [contacts, setContacts] = React.useState<any[]>([]);
  const [jobs, setJobs] = React.useState<any[]>([]);
  const [resources, setResources] = React.useState<any[]>([]);
  const [analytics, setAnalytics] = React.useState<any | null>(null);

  const [jobForm, setJobForm] = React.useState({
    title: "",
    location: "",
    employment_type: "",
    department: "",
    description: "",
    requirements: "",
  });
  const [resourceForm, setResourceForm] = React.useState({
    title: "",
    resource_type: "",
    file_url: "",
    description: "",
  });

  const navigate = useNavigate();
  const [adminToken, setAdminToken] = React.useState<string | null>(null);
  const [authChecked, setAuthChecked] = React.useState(false);

  React.useEffect(() => {
    const tok = localStorage.getItem("adminToken");
    if (tok) setAdminToken(tok);
    setAuthChecked(true);
  }, []);

  React.useEffect(() => {
    if (!authChecked) return;
    if (!adminToken) {
      navigate("/login", { replace: true });
      return;
    }
    fetchList();
  }, [adminToken, authChecked, navigate]);

  const fetchList = async () => {
    const headers: any = { Accept: "application/json" };
    if (adminToken) headers.Authorization = `Bearer ${adminToken}`;

    const safeJson = async (resPromise: Promise<Response>) => {
      try {
        const res = await resPromise;
        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) return null;
        const json = await res.json().catch(() => null);
        return json;
      } catch (e) {
        return null;
      }
    };

    const [qResRaw, cResRaw, jResRaw, rResRaw, aRaw] = await Promise.all([
      safeJson(fetch("/api/admin/quotes", { headers })),
      safeJson(fetch("/api/admin/contacts", { headers })),
      safeJson(fetch("/api/admin/jobs", { headers })),
      safeJson(fetch("/api/admin/resources", { headers })),
      safeJson(fetch("/api/admin/analytics", { headers })),
    ]);

    const normalize = (v: any) => {
      if (!v) return [];
      if (Array.isArray(v)) return v;
      if (Array.isArray(v?.data)) return v.data;
      if (Array.isArray(v?.quotes)) return v.quotes;
      if (Array.isArray(v?.items)) return v.items;
      // fallback: if object with keys, convert to array of values
      if (typeof v === "object") return Object.values(v);
      return [];
    };

    setQuotes(normalize(qResRaw));
    setContacts(normalize(cResRaw));
    setJobs(normalize(jResRaw));
    setResources(normalize(rResRaw));
    setAnalytics(aRaw || null);
  };

  const submitJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const headers: any = { "content-type": "application/json" };
    if (adminToken) headers.Authorization = `Bearer ${adminToken}`;
    await fetch("/api/admin/jobs", {
      method: "POST",
      headers,
      body: JSON.stringify(jobForm),
    });
    setJobForm({
      title: "",
      location: "",
      employment_type: "",
      department: "",
      description: "",
      requirements: "",
    });
    fetchList();
  };

  const [uploading, setUploading] = React.useState(false);

  // Editing state for jobs
  const [editingJobId, setEditingJobId] = React.useState<
    string | number | null
  >(null);
  const [editingJob, setEditingJob] = React.useState<any>({
    title: "",
    location: "",
    employment_type: "",
    department: "",
    description: "",
    requirements: "",
  });

  const startEditJob = (j: any) => {
    setEditingJobId(j.id);
    setEditingJob({
      title: j.title || "",
      location: j.location || "",
      employment_type: j.employment_type || "",
      department: j.department || "",
      description: j.description || "",
      requirements: j.requirements || "",
    });
  };

  const saveJob = async () => {
    if (!editingJobId) return;
    const headers: any = { "content-type": "application/json" };
    if (adminToken) headers.Authorization = `Bearer ${adminToken}`;
    await fetch(`/api/admin/jobs/${editingJobId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(editingJob),
    });
    setEditingJobId(null);
    fetchList();
  };

  const deleteJob = async (id: any) => {
    if (!confirm("Delete this job?")) return;
    const headers: any = {};
    if (adminToken) headers.Authorization = `Bearer ${adminToken}`;
    await fetch(`/api/admin/jobs/${id}`, { method: "DELETE", headers });
    fetchList();
  };

  // Editing state for resources
  const [editingResourceId, setEditingResourceId] = React.useState<
    string | number | null
  >(null);
  const [editingResource, setEditingResource] = React.useState<any>({
    title: "",
    resource_type: "",
    file_url: "",
    description: "",
  });

  const startEditResource = (r: any) => {
    setEditingResourceId(r.id);
    setEditingResource({
      title: r.title || "",
      resource_type: r.resource_type || "",
      file_url: r.file_url || "",
      description: r.description || "",
    });
  };

  const saveResource = async () => {
    if (!editingResourceId) return;
    const headers: any = { "content-type": "application/json" };
    if (adminToken) headers.Authorization = `Bearer ${adminToken}`;
    await fetch(`/api/admin/resources/${editingResourceId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(editingResource),
    });
    setEditingResourceId(null);
    fetchList();
  };

  const deleteResource = async (id: any) => {
    if (!confirm("Delete this resource?")) return;
    const headers: any = {};
    if (adminToken) headers.Authorization = `Bearer ${adminToken}`;
    await fetch(`/api/admin/resources/${id}`, { method: "DELETE", headers });
    fetchList();
  };

  const submitResource = async (e: React.FormEvent) => {
    e.preventDefault();
    const headers: any = { "content-type": "application/json" };
    if (adminToken) headers.Authorization = `Bearer ${adminToken}`;
    await fetch("/api/admin/resources", {
      method: "POST",
      headers,
      body: JSON.stringify(resourceForm),
    });
    setResourceForm({
      title: "",
      resource_type: "",
      file_url: "",
      description: "",
    });
    fetchList();
  };

  const handleFileChange = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      // upload to server
      const bucket = "resources";
      const path = `${Date.now()}-${file.name}`;
      const headers: any = { "content-type": "application/json" };
      if (adminToken) headers.Authorization = `Bearer ${adminToken}`;
      const resp = await fetch("/api/admin/upload", {
        method: "POST",
        headers,
        body: JSON.stringify({
          bucket,
          path,
          file_base64: base64,
          contentType: file.type,
        }),
      });
      const ct = resp.headers.get("content-type") || "";
      const data = ct.includes("application/json")
        ? await resp.json().catch(() => null)
        : null;
      if (data?.url) {
        setResourceForm((s) => ({ ...s, file_url: data.url }));
      } else {
        console.error(
          "Upload failed",
          data || (await resp.text().catch(() => "")),
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const download = async (key: string) => {
    try {
      const headers: any = {};
      if (adminToken) headers.Authorization = `Bearer ${adminToken}`;
      const resp = await fetch(`/api/admin/export/${key}`, { headers });
      if (!resp.ok) {
        const txt = await resp.text();
        alert("Export failed: " + txt);
        return;
      }
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${key}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Export failed");
      console.error(err);
    }
  };

  const downloadExcel = async () => {
    try {
      const headers: any = {};
      if (adminToken) headers.Authorization = `Bearer ${adminToken}`;
      const resp = await fetch(`/api/admin/export-all/xlsx`, { headers });
      if (!resp.ok) {
        const txt = await resp.text();
        alert("Export failed: " + txt);
        return;
      }
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `forms-export.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Export failed");
      console.error(err);
    }
  };

  function DataTable({
    rows,
    preferred,
    emptyLabel,
  }: {
    rows: any[];
    preferred: string[];
    emptyLabel: string;
  }) {
    const cols = React.useMemo(() => {
      const first = rows && rows[0];
      const keys = first ? Object.keys(first) : [];
      const ordered = Array.from(new Set([...(preferred || []), ...keys]));
      return ordered.slice(0, 8);
    }, [rows, preferred]);

    if (!rows || rows.length === 0) {
      return <div className="text-sm text-muted-foreground">{emptyLabel}</div>;
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            {cols.map((c) => (
              <TableHead key={c} className="capitalize">
                {c.replace(/_/g, " ")}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r, idx) => (
            <TableRow key={r.id ?? idx}>
              {cols.map((c) => (
                <TableCell key={c}>{formatCell(r[c])}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableCaption>{rows.length} records</TableCaption>
      </Table>
    );
  }

  function formatCell(v: any) {
    if (v === null || v === undefined) return "";
    if (typeof v === "string") return v;
    if (typeof v === "number" || typeof v === "boolean") return String(v);
    if (v instanceof Date) return v.toISOString();
    return JSON.stringify(v);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
          {!adminToken ? (
            <div className="mb-6 text-sm text-muted-foreground">
              {authChecked
                ? "Redirecting to admin login..."
                : "Checking admin session..."}
            </div>
          ) : (
            <div className="mb-4 text-sm">
              Logged in.{" "}
              <Button
                variant="outline"
                onClick={() => {
                  localStorage.removeItem("adminToken");
                  window.location.href = "/login";
                }}
              >
                Logout
              </Button>
            </div>
          )}

          {adminToken && (
            <section className="mb-8">
              <div className="bg-white/80 p-6 rounded-xl shadow">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <h2 className="font-semibold">Submissions</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={downloadExcel}>
                      Download All (Excel)
                    </Button>
                  </div>
                </div>

                {analytics && (
                  <div className="mb-4 grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    <div className="p-3 bg-gray-50 rounded">
                      Total Quotes: <b>{analytics.totals?.quotes}</b>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      Total Contacts: <b>{analytics.totals?.contacts}</b>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      Total Jobs: <b>{analytics.totals?.jobs}</b>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      Total Resources: <b>{analytics.totals?.resources}</b>
                    </div>
                  </div>
                )}

                <Tabs defaultValue="quotes">
                  <TabsList className="mb-4">
                    <TabsTrigger value="quotes">Quotes</TabsTrigger>
                    <TabsTrigger value="contacts">Contacts</TabsTrigger>
                    <TabsTrigger value="jobs">Applications</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                  </TabsList>

                  <TabsContent value="quotes">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Quotes</h3>
                      <Button size="sm" onClick={() => download("quotes")}>
                        Download CSV
                      </Button>
                    </div>
                    <DataTable
                      rows={quotes}
                      preferred={[
                        "id",
                        "name",
                        "category",
                        "bill",
                        "bill_range",
                        "whatsapp",
                        "pincode",
                        "created_at",
                      ]}
                      emptyLabel="No quotes"
                    />
                  </TabsContent>

                  <TabsContent value="contacts">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Contacts</h3>
                      <Button size="sm" onClick={() => download("contacts")}>
                        Download CSV
                      </Button>
                    </div>
                    <DataTable
                      rows={contacts}
                      preferred={[
                        "id",
                        "name",
                        "email",
                        "phone",
                        "message",
                        "created_at",
                      ]}
                      emptyLabel="No contacts"
                    />
                  </TabsContent>

                  <TabsContent value="jobs">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Applications</h3>
                      <Button size="sm" onClick={() => download("jobs")}>
                        Download CSV
                      </Button>
                    </div>
                    <DataTable
                      rows={jobs}
                      preferred={[
                        "id",
                        "title",
                        "location",
                        "employment_type",
                        "department",
                        "created_at",
                      ]}
                      emptyLabel="No items"
                    />
                  </TabsContent>

                  <TabsContent value="resources">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Resources</h3>
                      <Button size="sm" onClick={() => download("resources")}>
                        Download CSV
                      </Button>
                    </div>
                    <DataTable
                      rows={resources}
                      preferred={[
                        "id",
                        "title",
                        "resource_type",
                        "file_url",
                        "description",
                        "created_at",
                      ]}
                      emptyLabel="No resources"
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </section>
          )}

          {adminToken && (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <form
                onSubmit={submitJob}
                className="bg-white/80 p-6 rounded-xl shadow space-y-3"
              >
                <h3 className="font-semibold">Add Job</h3>
                <Input
                  placeholder="Title"
                  value={jobForm.title}
                  onChange={(e: any) =>
                    setJobForm({ ...jobForm, title: e.target.value })
                  }
                />
                <Input
                  placeholder="Location"
                  value={jobForm.location}
                  onChange={(e: any) =>
                    setJobForm({ ...jobForm, location: e.target.value })
                  }
                />
                <Input
                  placeholder="Employment Type"
                  value={jobForm.employment_type}
                  onChange={(e: any) =>
                    setJobForm({ ...jobForm, employment_type: e.target.value })
                  }
                />
                <Input
                  placeholder="Department"
                  value={jobForm.department}
                  onChange={(e: any) =>
                    setJobForm({ ...jobForm, department: e.target.value })
                  }
                />
                <Textarea
                  placeholder="Description"
                  value={jobForm.description}
                  onChange={(e: any) =>
                    setJobForm({ ...jobForm, description: e.target.value })
                  }
                />
                <Textarea
                  placeholder="Requirements"
                  value={jobForm.requirements}
                  onChange={(e: any) =>
                    setJobForm({ ...jobForm, requirements: e.target.value })
                  }
                />
                <Button type="submit">Create Job</Button>
              </form>

              <form
                onSubmit={submitResource}
                className="bg-white/80 p-6 rounded-xl shadow space-y-3"
              >
                <h3 className="font-semibold">Add Resource</h3>
                <Input
                  placeholder="Title"
                  value={resourceForm.title}
                  onChange={(e: any) =>
                    setResourceForm({ ...resourceForm, title: e.target.value })
                  }
                />
                <Input
                  placeholder="Type (whitepaper/pdf/link)"
                  value={resourceForm.resource_type}
                  onChange={(e: any) =>
                    setResourceForm({
                      ...resourceForm,
                      resource_type: e.target.value,
                    })
                  }
                />

                <div className="flex items-center gap-2">
                  <input
                    id="resource-file"
                    type="file"
                    accept="*/*"
                    onChange={(e: any) => {
                      const f = e.target.files && e.target.files[0];
                      handleFileChange(f);
                    }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {uploading
                      ? "Uploading..."
                      : resourceForm.file_url
                        ? "Uploaded"
                        : "No file"}
                  </span>
                </div>

                <Input
                  placeholder="File URL (override)"
                  value={resourceForm.file_url}
                  onChange={(e: any) =>
                    setResourceForm({
                      ...resourceForm,
                      file_url: e.target.value,
                    })
                  }
                />
                <Textarea
                  placeholder="Description"
                  value={resourceForm.description}
                  onChange={(e: any) =>
                    setResourceForm({
                      ...resourceForm,
                      description: e.target.value,
                    })
                  }
                />
                <Button type="submit" disabled={uploading}>
                  Create Resource
                </Button>
              </form>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
