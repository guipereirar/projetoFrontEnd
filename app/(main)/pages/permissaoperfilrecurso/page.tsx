/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Projeto } from '@/types';
import { PerfilUsuarioService } from '@/service/PerfilUsuarioService';
import { UsuarioService } from '@/service/UsuarioService';
import { PerfilService } from '@/service/PerfilService';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { PermissaoPerfilRecursoSerivce } from '@/service/PermissaoPerfilRecursoService';
import { RecursoService } from '@/service/RecursoService';

const PermissaoPerfilRecurso = () => {
    let permissaoPerfilRecursoVazio: Projeto.PermissaoPerfilRecurso = {
        id: 0,
        perfil: { descricao: '' },
        recurso: { nome: '', chave: '' }
    };

    const [permissoesPerfilRecurso, setPermissoesPerfilRecurso] = useState<Projeto.PermissaoPerfilRecurso[] | null>(null);
    const [permissaoPerfilRecursoDialog, setPermissaoPerfilRecursoDialog] = useState(false);
    const [deletePermissaoPerfilRecursoDialog, setDeletePermissaoPerfilRecursoDialog] = useState(false);
    const [deletePermissoesPerfilRecursoDialog, setDeletePermissoesPerfilRecursoDialog] = useState(false);
    const [permissaoPerfilRecurso, setPermissaoPerfilRecurso] = useState<Projeto.PermissaoPerfilRecurso>(permissaoPerfilRecursoVazio);
    const [selectedPermissoesPerfilRecurso, setSelectedPermissoesPerfilRecurso] = useState<Projeto.PermissaoPerfilRecurso[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const permissaoPerfilRecursoService = useMemo(() => new PermissaoPerfilRecursoSerivce(), []);
    const recursoService = useMemo(() => new RecursoService(), []);
    const perfilService = useMemo(() => new PerfilService(), []);
    const [recursos, setRecursos] = useState<Projeto.Recurso[]>([]);
    const [perfis, setPerfis] = useState<Projeto.Perfil[]>([]);

    useEffect(() => {
        if (!permissoesPerfilRecurso) {
            permissaoPerfilRecursoService
                .listarTodos()
                .then((response) => {
                    console.log(response.data);
                    setPermissoesPerfilRecurso(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [permissaoPerfilRecursoService, permissoesPerfilRecurso]);

    useEffect(() => {
        if (permissaoPerfilRecursoDialog) {
            recursoService
                .listarTodos()
                .then((response) => {
                    setRecursos(response.data);
                })
                .catch((error) => {
                    console.log(error);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Erro!',
                        detail: 'Erro ao carregar a lista de recursos'
                    });
                });
            perfilService
                .listarTodos()
                .then((response) => {
                    setPerfis(response.data);
                })
                .catch((error) => {
                    console.log(error);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Erro!',
                        detail: 'Erro ao carregar a lista de perfis'
                    });
                });
        }
    }, [permissaoPerfilRecursoDialog, perfilService, recursoService]);

    const openNew = () => {
        setPermissaoPerfilRecurso(permissaoPerfilRecursoVazio);
        setSubmitted(false);
        setPermissaoPerfilRecursoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPermissaoPerfilRecursoDialog(false);
    };

    const hideDeletePermissaoPerfilRecursoDialog = () => {
        setDeletePermissaoPerfilRecursoDialog(false);
    };

    const hideDeletePermissoesPerfilRecursoDialog = () => {
        setDeletePermissoesPerfilRecursoDialog(false);
    };

    const savePermissaoPerfilRecurso = () => {
        setSubmitted(true);

        if (!permissaoPerfilRecurso.id) {
            permissaoPerfilRecursoService
                .inserir(permissaoPerfilRecurso)
                .then((response) => {
                    setPermissaoPerfilRecursoDialog(false);
                    setPermissaoPerfilRecurso(permissaoPerfilRecursoVazio);
                    setPermissoesPerfilRecurso(null);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail: 'Recurso do perfil cadastrado com sucesso!'
                    });
                })
                .catch((error) => {
                    console.log(error);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Erro!',
                        detail: 'Erro ao salvar'
                    });
                });
        } else {
            permissaoPerfilRecursoService
                .alterar(permissaoPerfilRecurso)
                .then((response) => {
                    setPermissaoPerfilRecursoDialog(false);
                    setPermissaoPerfilRecurso(permissaoPerfilRecursoVazio);
                    setPermissoesPerfilRecurso(null);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail: 'Recurso do perfil alterado com sucesso!'
                    });
                })
                .catch((error) => {
                    console.log(error);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Erro!',
                        detail: 'Erro ao alterar'
                    });
                });
        }
    };

    const editPermissaoPerfilRecurso = (permissaoPerfilRecurso: Projeto.PermissaoPerfilRecurso) => {
        setPermissaoPerfilRecurso({ ...permissaoPerfilRecurso });
        setPermissaoPerfilRecursoDialog(true);
    };

    const confirmDeletePermissaoPerfilRecurso = (permissaoPerfilRecurso: Projeto.PermissaoPerfilRecurso) => {
        setPermissaoPerfilRecurso(permissaoPerfilRecurso);
        setDeletePermissaoPerfilRecursoDialog(true);
    };

    const deletePermissaoPerfilRecurso = () => {
        if (permissaoPerfilRecurso.id) {
            permissaoPerfilRecursoService
                .excluir(permissaoPerfilRecurso.id)
                .then((response) => {
                    setPermissaoPerfilRecurso(permissaoPerfilRecursoVazio);
                    setDeletePermissaoPerfilRecursoDialog(false);
                    setPermissoesPerfilRecurso(null);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Successo!',
                        detail: 'Recurso do perfil deletado com sucesso!',
                        life: 3000
                    });
                })
                .catch((error) => {
                    console.log(error);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: 'Erro ao deletar recurso do perfil',
                        life: 3000
                    });
                });
        }
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeletePermissoesPerfilRecursoDialog(true);
    };

    const deleteSelectedPermissoesPerfilRecurso = () => {
        Promise.all(
            selectedPermissoesPerfilRecurso.map(async (_permissaoPerfilRecurso) => {
                if (_permissaoPerfilRecurso.id) {
                    await permissaoPerfilRecursoService
                        .excluir(_permissaoPerfilRecurso.id)
                        .then((response) => {})
                        .catch((error) => {});
                }
            })
        )
            .then((response) => {
                setPermissoesPerfilRecurso(null);
                setSelectedPermissoesPerfilRecurso([]);
                setDeletePermissoesPerfilRecursoDialog(false);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successo!',
                    detail: 'Perfil do Usuario deletado com sucesso!',
                    life: 3000
                });
            })
            .catch((error) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: 'Erro ao deletar perfis',
                    life: 3000
                });
            });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        // let _recurso = { ...recurso };
        // _recurso[`${name}`] = val;

        // setRecurso(_recurso);
        setPermissaoPerfilRecurso((prevPermissaoPerfilRecurso) => ({
            ...prevPermissaoPerfilRecurso,
            [name]: val
        }));
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedPermissoesPerfilRecurso || !(selectedPermissoesPerfilRecurso as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData: Projeto.PermissaoPerfilRecurso) => {
        return (
            <>
                <span className="p-column-title">Código</span>
                {rowData.id}
            </>
        );
    };

    const perfilBodyTemplate = (rowData: Projeto.PermissaoPerfilRecurso) => {
        return (
            <>
                <span className="p-column-title">Perfil</span>
                {rowData.perfil.descricao}
            </>
        );
    };

    const recursoBodyTemplate = (rowData: Projeto.PermissaoPerfilRecurso) => {
        return (
            <>
                <span className="p-column-title">Recurso</span>
                {rowData.recurso.nome}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Projeto.PermissaoPerfilRecurso) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editPermissaoPerfilRecurso(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeletePermissaoPerfilRecurso(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciamento de recursos dos perfis</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const permissaoPerfilRecursoDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={savePermissaoPerfilRecurso} />
        </>
    );
    const deletePermissaoPerfilRecursoDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeletePermissaoPerfilRecursoDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deletePermissaoPerfilRecurso} />
        </>
    );
    const deletePermissoesPerfilRecursoDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeletePermissoesPerfilRecursoDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedPermissoesPerfilRecurso} />
        </>
    );

    const onSelectPerfilChange = (perfil: Projeto.Perfil) => {
        let _permissaoPerfilRecurso = { ...permissaoPerfilRecurso };
        _permissaoPerfilRecurso.perfil = perfil;
        setPermissaoPerfilRecurso(_permissaoPerfilRecurso);
    };

    const onSelectRecursoChange = (recurso: Projeto.Recurso) => {
        let _permissaoPerfilRecurso = { ...permissaoPerfilRecurso };
        _permissaoPerfilRecurso.recurso = recurso;
        setPermissaoPerfilRecurso(_permissaoPerfilRecurso);
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={permissoesPerfilRecurso}
                        selection={selectedPermissoesPerfilRecurso}
                        onSelectionChange={(e) => setSelectedPermissoesPerfilRecurso(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} recursos de perfis"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhum recurso de perfil encontrado."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Código" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="perfil" header="Perfil" sortable body={perfilBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="recurso" header="Recurso" sortable body={recursoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={permissaoPerfilRecursoDialog} style={{ width: '450px' }} header="Detalhes de Recursos e Perfis" modal className="p-fluid" footer={permissaoPerfilRecursoDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="perfil">Perfil</label>
                            <Dropdown optionLabel="descricao" value={permissaoPerfilRecurso.perfil} options={perfis} filter onChange={(e: DropdownChangeEvent) => onSelectPerfilChange(e.value)} placeholder="Selecione um perfil" />
                            {submitted && !permissaoPerfilRecurso.perfil && <small className="p-invalid">Perfil é obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="perfil">Recurso</label>
                            <Dropdown optionLabel="nome" value={permissaoPerfilRecurso.recurso} options={recursos} filter onChange={(e: DropdownChangeEvent) => onSelectRecursoChange(e.value)} placeholder="Selecione um recurso" />
                            {submitted && !permissaoPerfilRecurso.recurso && <small className="p-invalid">Recurso é obrigatório.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePermissaoPerfilRecursoDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deletePermissaoPerfilRecursoDialogFooter} onHide={hideDeletePermissaoPerfilRecursoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {permissaoPerfilRecurso && (
                                <span>
                                    Tem certeza que quer desassociar o recurso <b>{permissaoPerfilRecurso.recurso.nome}</b> do perfil <b>{permissaoPerfilRecurso.perfil.descricao}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePermissoesPerfilRecursoDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deletePermissoesPerfilRecursoDialogFooter} onHide={hideDeletePermissoesPerfilRecursoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {permissaoPerfilRecurso && <span>Tem certeza que quer desassociar os recursos dos perfis selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default PermissaoPerfilRecurso;
